const {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addMembers,
  removeMember,
  leaveGroup,
  sendAttachments,
  getChatDetails,
} = require("../controllers/chatControllers");
const { getMyProfile } = require("../controllers/userControllers");
const isAuthenticated = require("../middlewares/auth");
const { attachmentsMulter } = require("../middlewares/multer");

const router = require("express").Router();

router.use(isAuthenticated);

router.post("/createNewGroup", newGroupChat);

router.get("/my", getMyChats);

router.get("/my/groups", getMyGroups);

router.put("/addMembers", addMembers);

router.put("/removeMember", removeMember);

router.delete("/leave/:id", leaveGroup);

router.post("/message", attachmentsMulter, sendAttachments);

router.route("/:id").get(getChatDetails).put().delete();

module.exports = router;
