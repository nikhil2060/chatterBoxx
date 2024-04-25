const userSocketIDs = require("..");

module.exports.getOtherMembers = (members, userId) => {
  return members.find((member) => member._id.toString() !== userId.toString());
};

module.exports.getSockets = (users = []) => {
  const sockets = users.map((user) => userSocketIDs.get(user._id.toString()));

  return sockets;
};

module.exports.getBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
};
