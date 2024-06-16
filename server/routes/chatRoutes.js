const {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addMembers,
  removeMember,
  leaveGroup,
  sendAttachments,
  getChatDetails,
  renameGroup,
  deleteChat,
  getMessages,
} = require("../controllers/chatControllers");
const { getMyProfile } = require("../controllers/userControllers");
const { isAuthenticated } = require("../middlewares/auth");
const { attachmentsMulter } = require("../middlewares/multer");

// base = ${host}/api/chat/

const router = require("express").Router();

router.use(isAuthenticated);

router.post("/createNewGroup", newGroupChat);

router.get("/my", getMyChats);

router.get("/my/groups", getMyGroups);

router.put("/addMembers", addMembers);

router.put("/removeMember", removeMember);

router.delete("/leave/:id", leaveGroup);

router.post("/message", attachmentsMulter, sendAttachments);

router.get("/message/:id", getMessages);

router.route("/:id").get(getChatDetails).put(renameGroup).delete(deleteChat);

module.exports = router;
