const getOtherMembers = (members, userId) => {
  return members.find((member) => member._id.toString() !== userId.toString());
};

const userSocketIDs = new Map();

const getSockets = (users = []) => {
  const sockets = users.map((user) => userSocketIDs.get(user.toString()));
  return sockets.filter(Boolean); // Filter out undefined values
};

module.exports = {
  userSocketIDs,
  getSockets,
  getOtherMembers,
};
