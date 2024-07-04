const Chat = require("../model/chatModel");
const User = require("../model/userModel");
const Message = require("../model/messageModel");

const {
  emitEvent,
  deleteFilesFromCloudnary,
  uploadFilesToCloudnary,
} = require("../utils/features");
const {
  ALERT,
  REFETCH_CHATS,
  NEW_ATTACHMENTS,
  NEW_MESSAGE_ALERT,
  NEW_MESSAGE,
} = require("../constants/events");
const { getOtherMembers } = require("../lib/helper");

module.exports.newGroupChat = async (req, res, next) => {
  try {
    const { name, members } = req.body;

    const allMembers = [...members, req.user];

    if (allMembers.length < 3)
      return res
        .status(400)
        .json({ status: false, msg: "Group must have at least 3 members" });

    await Chat.create({
      name,
      groupChat: true,
      creater: req.user,
      members: allMembers,
    });

    emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);

    emitEvent(req, REFETCH_CHATS, members);

    return res.status(201).json({
      status: true,
      msg: "Group chat created",
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getMyChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ members: req.user }).populate(
      "members",
      "name avatar"
    );

    if (!chats)
      return res.status(400).json({
        status: false,
        msg: "No chats found",
      });

    const transformedChats = chats.map(({ _id, groupChat, members, name }) => {
      const otherMember = getOtherMembers(members, req.user);
      return {
        _id,
        name: groupChat ? name : otherMember.name,
        avatar: groupChat
          ? members.slice(0, 3).map(({ avatar }) => avatar.url)
          : [otherMember.avatar.url],
        groupChat,
        members: members.reduce((prev, curr) => {
          if (curr._id.toString() !== req.user.toString()) {
            prev.push(curr._id);
          }
          return prev;
        }, []),
      };
    });

    return res.status(200).json({
      status: true,
      chats: transformedChats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getMyGroups = async (req, res, next) => {
  try {
    const chats = await Chat.find({
      members: req.user,
      groupChat: true,
      creater: req.user,
    }).populate("members", "name avatar");

    if (!chats)
      return res.status(400).json({
        status: false,
        msg: "No groups found",
      });

    const groups = chats.map(({ members, _id, groupChat, name }) => ({
      _id,
      groupChat,
      name,
      avatar: members.slice(0, 3).map(({ avatar }) => avatar.toObject().url),
    }));

    return res.status(200).json({
      status: true,
      groups,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.addMembers = async (req, res, next) => {
  try {
    const { chatId, members } = req.body;

    if (members.length < 1)
      return res.status(400).json({
        status: false,
        msg: "Please add members",
      });

    const chat = await Chat.findById(chatId);

    if (!chat)
      return res.status(400).json({
        status: false,
        msg: "No Chat Found",
      });

    if (!chat.groupChat)
      return res.status(400).json({
        status: false,
        msg: "This is not a group chat.",
      });

    if (chat.creater.toString() !== req.user.toString())
      return res.status(403).json({
        status: false,
        msg: "You are not allowed to add group members",
      });

    const allMembersPromise = members.map((i) => User.findById(i, "name"));

    const allNewMembers = await Promise.all(allMembersPromise);

    const uniqueMembers = allNewMembers.filter(
      (i) => !chat.members.includes(i._id.toString())
    );

    chat.members.push(...uniqueMembers.map((i) => i._id));

    if (chat.members.length > 25)
      return res.status(403).json({
        status: false,
        msg: "Group limit reached",
      });

    await chat.save();

    const allUsersName = allNewMembers.map((i) => i.name).join(",");

    emitEvent(
      req,
      ALERT,
      chat.members,
      `You have been added to ${chat.name} by ${req.user.name}`
    );

    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
      status: true,
      msg: "Member added Succesfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports.removeMember = async (req, res, next) => {
  try {
    const { chatId, userId } = req.body;

    const [chat, userThatWillBeRemoved] = await Promise.all([
      Chat.findById(chatId),
      User.findById(userId, "name"),
    ]);

    if (!chat)
      return res.status(404).json({
        status: false,
        msg: "No Chat Found",
      });

    if (chat.members.length <= 3)
      return res.status(400).json({
        status: false,
        msg: "Group must have at least 3 members",
      });

    const allChatMembers = chat.members.map((i) => i.toString());

    chat.members = chat.members.filter(
      (member) => member.toString() !== userId.toString()
    );

    await chat.save();

    emitEvent(
      req,
      ALERT,
      chat.members,
      `${userThatWillBeRemoved} has been removed from the group`
    );

    emitEvent(req, REFETCH_CHATS, allChatMembers);

    return res.status(200).json({
      status: true,
      msg: "Member Removed Succesfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports.leaveGroup = async (req, res, next) => {
  try {
    const chatId = req.params.id;
    const userId = req.user;

    if (!userId) {
      return res.status(400).json({
        status: false,
        msg: "User ID is required",
      });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        status: false,
        msg: "No Chat Found",
      });
    }

    if (!chat.groupChat) {
      return res.status(400).json({
        status: false,
        msg: "This is not a group chat",
      });
    }

    const userIndex = chat.members.findIndex(
      (member) => member && member.toString() === userId.toString()
    );

    if (userIndex === -1) {
      return res.status(400).json({
        status: false,
        msg: "User is not a member of this group",
      });
    }

    const remainingMembers = chat.members.filter(
      (member) => member && member.toString() !== userId.toString()
    );

    if (remainingMembers.length < 2) {
      return res.status(400).json({
        status: false,
        msg: "Group must have at least 3 members",
      });
    }

    // If the user leaving is the creator, assign a new creator
    if (chat.creator && chat.creator.toString() === userId.toString()) {
      chat.creator = remainingMembers[0];
    }

    // Remove the user from the chat members
    chat.members = remainingMembers;

    const user = await User.findById(userId, "name");

    if (!user) {
      return res.status(400).json({
        status: false,
        msg: "User not found",
      });
    }

    await chat.save();

    emitEvent(req, ALERT, chat.members, `User ${user.name} has left the group`);

    return res.status(200).json({
      status: true,
      msg: "Group left successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports.sendAttachments = async (req, res, next) => {
  try {
    const { chatId } = req.body;

    const files = req.files || [];

    if (files.length < 1)
      return res.status(400).json("Please provide attachments");

    if (files.length > 5)
      return res.status(400).json("Files cannot be more than 5");

    const [chat, me] = await Promise.all([
      Chat.findById(chatId),
      User.findById(req.user, "name"),
    ]);

    if (!chat)
      return res.status(404).json({
        status: false,
        msg: "No Chat Found",
      });

    // UPLOAD FILES
    const attachments = await uploadFilesToCloudnary(files);

    const messageForDB = {
      content: "",
      attachments,
      sender: me._id.toString(),
      chat: chatId,
    };

    const messageForRealTime = {
      ...messageForDB,
      sender: {
        _id: me._id.toString(),
        name: me.name,
      },
    };

    const message = await Message.create(messageForDB);

    emitEvent(req, NEW_MESSAGE, chat.members, {
      message: messageForRealTime,
      chatId,
    });

    emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });

    return res.status(200).json({
      status: true,
      message: messageForRealTime,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getChatDetails = async (req, res, next) => {
  try {
    if (req.query.populate === "true") {
      const chat = await Chat.findById(req.params.id)
        .populate("members", "name avatar username bio")
        .lean();

      if (!chat)
        return res.status(404).json({
          status: false,
          msg: "Chat not found",
        });

      chat.members = chat.members.map(
        ({ _id, name, avatar, username, bio }) => ({
          _id,
          name,
          username,
          bio,
          avatar: avatar.url,
        })
      );

      return res.status(200).json({
        status: true,
        chat,
      });
    } else {
      const chat = await Chat.findById(req.params.id);

      if (!chat)
        return res.status(404).json({
          status: false,
          msg: "Chat not found",
        });

      return res.status(200).json({
        status: true,
        chat,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports.renameGroup = async (req, res, next) => {
  try {
    const chatId = req.params.id;
    const { name } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat)
      return res.status(404).json({
        status: false,
        msg: "Chat not found",
      });

    if (!chat.groupChat)
      return res.status(404).json({
        status: false,
        msg: "Chat not found",
      });

    if (chat.creater.toString() !== req.user.toString())
      return res.status(403).json({
        status: false,
        msg: "You are not allowed to rename the group",
      });

    chat.name = name;

    await chat.save();

    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
      status: true,
      msg: "Rename successfull",
    });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteChat = async (req, res, next) => {
  try {
    const chatId = req.params.id;

    const chat = await Chat.findById(chatId);

    if (!chat)
      return res.status(404).json({
        status: false,
        msg: "Chat not found",
      });

    // if (!chat.groupChat)
    //   return res.status(404).json({
    //     status: false,
    //     msg: "Chat not found",
    //   });

    if (chat.groupChat && chat.creater.toString() !== req.user.toString())
      return res.json({
        status: false,
        msg: "You are not the creater of this group",
      });

    const members = chat.members;

    // Here we have to delete all the messages and attachments from cloudnary

    const messageWithAttachments = await Message.find({
      chat: chatId,
      attachments: { $exists: true, $ne: [] },
    });

    const public_ids = [];

    messageWithAttachments.forEach(({ attachments }) => {
      attachments.forEach(({ public_id }) => {
        public_ids.push(public_id);
      });
    });

    await Promise.all([
      // DELETE FILES FROM cloudnary
      deleteFilesFromCloudnary(public_ids),
      chat.deleteOne(),
      Message.deleteMany({ chat: chatId }),
    ]);

    // await chat.remove();

    // await chat.save();

    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
      status: true,
      msg: "Chat deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getMessages = async (req, res, next) => {
  try {
    const chatId = req.params.id;

    const { page = 1 } = req.query;

    const resultPerPage = 20;
    const skip = (page - 1) * resultPerPage;

    const chat = await Chat.findById(chatId);

    if (!chat)
      return res.status(404).json({
        status: false,
        msg: "Chat not found",
      });

    if (!chat.members.includes(req.user.toString())) {
      return res.status(404).json({
        status: false,
        msg: "You are not allowed to access this chat",
      });
    }

    const [messages, totalMessagesCount] = await Promise.all([
      Message.find({ chat: chatId })
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(resultPerPage)
        .populate("sender", "name avatar")
        .lean(),
      Message.countDocuments({ chat: chatId }),
    ]);

    const totalPages = Math.ceil(totalMessagesCount / resultPerPage);

    // emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
      status: true,
      message: messages.reverse(),
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};
