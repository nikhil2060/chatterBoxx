const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies["chatterBox-token"];

    // console.log(token);

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

module.exports = isAuthenticated;
