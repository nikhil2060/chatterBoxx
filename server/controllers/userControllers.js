const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const { sendToken, cookieOptions } = require("../utils/features");

module.exports.register = async (req, res, next) => {
  try {
    const { name, username, email, password, avatar, bio } = req.body;

    const usernameCheck = await User.findOne({ username });

    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });

    const emailCheck = await User.findOne({ email });

    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
      bio,
    });

    delete user.password;

    sendToken(res, user, 201, "userCreated");

    // return res.json({ status: true, user });

    // return res.status(201).json({ message: "user created succesfuly" });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    // console.log(req.body);

    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password");

    // console.log(user);

    if (!user) return res.json({ msg: "Incorrect Username", status: false });

    // const isValidPassword = await bcrypt.compare(password, user.password);

    // if (!isValidPassword)
    //   return res.json({ msg: "Incorrect Password", status: false });

    // delete user.password;

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

    console.log(req.body);

    console.log(fileName);
    console.log(userId);

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
  // console.log("hello");
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
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(RangeError);
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    res
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
