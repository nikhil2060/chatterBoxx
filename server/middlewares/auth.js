const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies["chatterBox-token"];

    if (!token)
      res.json({ status: false, msg: "Please login to access this route" });

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    // console.log(decodedData);

    req.user = decodedData._id;

    next();
  } catch (error) {
    next(error);
  }
};

const socketAuthenticator = async (err, socket, next) => {
  try {
    const authToken = socket.request.cookies["chatterBox-token"];

    // console.log(authToken);

    if (!authToken)
      res.json({ status: false, msg: "Please login to access this route" });

    const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

    const user = await User?.findById(decodedData?._id);

    if (!user)
      res.json({ status: false, msg: "Please login to access this route" });

    socket.user = user;

    return next();
  } catch (err) {
    console.log(err);
    next();
  }
};

module.exports = { isAuthenticated, socketAuthenticator };
