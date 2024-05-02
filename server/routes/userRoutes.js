const {
  register,
  getAllUsers,
  getMyProfile,
  logout,
  searchUser,
  sendFriendRequest,
  acceptFriendRequest,
  getMyNotifications,
  getMyFriends,
} = require("../controllers/userControllers");

const { login } = require("../controllers/userControllers");

const { isAuthenticated } = require("../middlewares/auth");
// const multer = require("multer");
const { singleAvatar } = require("../middlewares/multer");

const router = require("express").Router();

router.post("/register", singleAvatar, register);

router.post("/login", login);

// AFTER THIS USER MUST BE LOGGED IN \

router.use(isAuthenticated);

router.get("/me", getMyProfile);

router.get("/logout", logout);

router.get("/search", searchUser);

router.put("/sendRequest", sendFriendRequest);

router.put("/acceptRequest", acceptFriendRequest);

router.get("/notifications", getMyNotifications);

router.get("/friends", getMyFriends);

router.get("/allusers/:id", getAllUsers);

// /////////////////////////////////////////////////////////////////////////////

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now();
//     cb(null, uniqueSuffix + file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// router.post("/uploadpic", upload.single("image"), uploadpic);

module.exports = router;
