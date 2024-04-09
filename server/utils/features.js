const jwt = require("jsonwebtoken");

const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  secure: true,
  httpOnly: true,
};

const sendToken = (res, user, code, message) => {
  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET
  );

  return res
    .status(code)
    .cookie("chatterBox-token", token, cookieOptions)
    .json({ msg: message, success: true });
};

const emitEvent = (req, event, users, data) => {
  console.log("Emittting Event ...");
};

module.exports = { sendToken, cookieOptions, emitEvent };
