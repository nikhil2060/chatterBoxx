const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
const { v2: cloudnary } = require("cloudinary");
const { getBase64 } = require("../middlewares/helper");
const { getSockets } = require("../lib/helper");

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
    .json({ msg: message, status: true, user });
};

const emitEvent = (req, event, users, data) => {
  let io = req.app.get("io");
  const membersSocket = getSockets(users);
  io.to(membersSocket).emit(event, data);
};

const uploadFilesToCloudnary = async ([...files]) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudnary.uploader.upload(
        getBase64(file),
        {
          resource_type: "auto",
          public_id: uuid(),
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  });

  try {
    const results = await Promise.all(uploadPromises);

    const formattedResults = results.map((result) => ({
      public_id: result.public_id,
      url: result.url,
    }));

    return formattedResults;
  } catch (error) {
    throw new Error("Error in uploading files to cloudnary", error);
  }
};

const deleteFilesFromCloudnary = async (public_id) => {
  // Delete files from cloudnaty
};

module.exports = {
  sendToken,
  cookieOptions,
  emitEvent,
  deleteFilesFromCloudnary,
  uploadFilesToCloudnary,
};
