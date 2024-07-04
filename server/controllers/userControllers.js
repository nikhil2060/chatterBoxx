const User = require("../model/userModel");
const Chat = require("../model/chatModel");
const Request = require("../model/requestModel");

const bcrypt = require("bcrypt");
const {
  sendToken,
  cookieOptions,
  emitEvent,
  uploadFilesToCloudnary,
} = require("../utils/features");
const { NEW_REQUEST, REFETCH_CHATS } = require("../constants/events");
const { getOtherMembers } = require("../lib/helper");

module.exports.register = async (req, res, next) => {
  try {
    const { name, username, email, password, bio } = req.body;

    const file = req.file;

    if (!file)
      return res.status(400).json({
        msg: "Please Upload Avatar",
        status: false,
      });

    const usernameCheck = await User.findOne({ username });

    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });

    const emailCheck = await User.findOne({ email });

    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await uploadFilesToCloudnary([file]);

    const user = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
      bio,
      avatar: {
        public_id: result[0]?.public_id,
        url: result[0]?.url,
      },
    });

    delete user.password;

    sendToken(res, user, 201, "User registered successfully");
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password");

    if (!user) return res.json({ msg: "Incorrect Username", status: false });

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return res.json({ msg: "Incorrect Password", status: false });

    delete user.password;

    sendToken(res, user, 201, `Welcome back ${user.name}`);

    // return res.json({ status: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports.uploadpic = async (req, res, next) => {
  try {
    const fileName = req.file.filename;
    const userId = req.body.userId;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatarImage: fileName, isAvatarImageSet: true },
      { new: true }
    ); // to get the updated user document

    return res.json({
      status: true,
      user: updatedUser,
      msg: "Image uploaded successfully",
    });
  } catch (error) {
    res.json({ msg: "Server error", status: false });
    next(error);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "id",
    ]);

    return res.json({
      users,
      status: true,
      // msg: "Image uploaded successfully",
    });
  } catch (error) {
    res.json({ msg: "Server error", status: false });
    next(error);
  }
};

module.exports.getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);

    if (!user)
      return res.status(400).json({
        status: false,
        msg: "User not exists",
      });

    return res.status(200).json({
      status: true,
      user,
    });
  } catch (error) {
    next(RangeError);
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    return res
      .status(200)
      .cookie("chatterBox-token", "", { ...cookieOptions, maxAge: 0 })
      .json({
        status: true,
        msg: "Logged Out Succesfully",
      });
  } catch (error) {
    next(RangeError);
  }
};

module.exports.searchUser = async (req, res, next) => {
  try {
    let { name = "" } = req.query;

    const myChats = await Chat.find({
      groupChat: false,
      members: req.user,
    });

    const allUsersFromMyChats = myChats.map((chat) => chat.members).flat();

    const allUsersExceptMeAndFriends = await User.find({
      _id: { $nin: allUsersFromMyChats },
      name: { $regex: name, $options: "i" }, //find pattern predictor
    });

    const users = allUsersExceptMeAndFriends.map(
      ({ _id, name, avatar, username }) => ({
        _id,
        name,
        username,
        avatar: avatar.url,
      })
    );

    return res.status(200).json({
      status: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.sendFriendRequest = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId)
      return res.status(400).json({
        msg: "Please Enter User Id",
        status: false,
      });

    const request = await Request.findOne({
      $or: [
        { sender: req.user, receiver: userId },
        // { sender: userId, receiver: req.user },
      ],
    })
      .populate("sender", "name")
      .populate("receiver", "name");

    if (request)
      return res.status(200).json({
        status: false,
        msg: "Request already sent",
      });

    await Request.create({
      sender: req.user,
      receiver: userId,
    });

    emitEvent(req, NEW_REQUEST, [userId]);

    return res.status(200).json({
      status: true,
      msg: "Friend Request Succesfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports.acceptFriendRequest = async (req, res, next) => {
  try {
    const { requestId, accept } = req.body;

    if (!requestId)
      return res.status(400).json({
        msg: "Please Enter Request Id",
        status: false,
      });

    const request = await Request.findById(requestId)
      .populate("sender", "name")
      .populate("receiver", "name");

    if (!request)
      return res.status(404).json({
        status: false,
        msg: "Request Not Found",
      });

    if (request.receiver._id.toString() !== req.user.toString())
      return res.status(401).json({
        msg: "You are not authorized to accept this request",
        status: false,
        request,
      });

    if (!accept) {
      await request.deleteOne();

      return res.status(200).json({
        msg: "Request Rejected",
        status: false,
      });
    }

    const members = [request.sender._id, request.receiver._id];

    await Promise.all([
      Chat.create({
        members,
        name: `${request.sender.name}-${request.receiver.name}`,
      }),
      request.deleteOne(),
    ]);

    emitEvent(req, REFETCH_CHATS, members);

    return res.status(200).json({
      status: true,
      msg: "Request accepted",
      senderId: request.sender._id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getMyNotifications = async (req, res, next) => {
  try {
    const requests = await Request.find({
      receiver: req.user,
    }).populate("sender", "name avatar username");

    const allRequests = requests.map(({ _id, sender }) => ({
      _id,
      sender: {
        _id: sender._id,
        name: sender.name,
        username: sender.username,
        avatar: sender.avatar.url,
      },
    }));

    return res.status(200).json({
      allRequests,
      status: true,
    });
  } catch (error) {
    res.json({ msg: "Server error", status: false });
    next(error);
  }
};

module.exports.getMyFriends = async (req, res, next) => {
  try {
    const chatId = req.query.chatId;

    const chats = await Chat.find({
      members: req.user,
      groupChat: false,
    }).populate("members", "name avatar");

    if (!chats)
      return res.status(400).json({
        status: false,
        msg: "Chats not found",
      });

    const friends = chats.map(({ members }) => {
      const otherUser = getOtherMembers(members, req.user);

      return {
        _id: otherUser._id,
        name: otherUser.name,
        avatar: otherUser.avatar.url,
      };
    });

    if (chatId) {
      const chat = await Chat.findById(chatId);

      const availableFriends = friends.filter(
        (friend) => !chat.members.includes(friend._id)
      );

      return res.status(200).json({
        status: true,
        friends: availableFriends,
      });
    } else {
      return res.status(200).json({
        status: true,
        friends,
      });
    }

    // emitEvent(req, REFETCH_CHATS, members);
  } catch (error) {
    next(error);
  }
};
