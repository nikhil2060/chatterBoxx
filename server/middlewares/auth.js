const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies["chatterBox-token"];

    if (!token) {
      return res
        .status(401)
        .json({ status: false, msg: "Please login to access this route" });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedData._id;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ status: false, msg: "Invalid token. Please login again." });
    }
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ status: false, msg: "Token expired. Please login again." });
    }
    // Handle other errors
    console.error("JWT verification error:", error);
    return res
      .status(500)
      .json({ status: false, msg: "Server error. Please try again later." });
  }
};

module.exports = isAuthenticated;

const socketAuthenticator = async (err, socket, next) => {
  try {
    const authToken = socket.request.cookies["chatterBox-token"];

    // console.log(authToken);

    if (!authToken)
      // res.json({ status: false, msg: "Please login to access this route" });
      return;

    const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

    const user = await User?.findById(decodedData?._id);

    if (!user)
      // res.json({ status: false, msg: "Please login to access this route" });
      return;

    socket.user = user;

    return next();
  } catch (err) {
    console.log(err);
    next();
  }
};

module.exports = { isAuthenticated, socketAuthenticator };
