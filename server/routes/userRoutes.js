const {
  register,
  uploadpic,
  getAllUsers,
  getMyProfile,
  logout,
} = require("../controllers/userControllers");
const { login } = require("../controllers/userControllers");
const isAuthenticated = require("../middlewares/auth");
// const multer = require("multer");
const { singleAvatar } = require("../middlewares/multer");

const router = require("express").Router();

router.post("/register", singleAvatar, register);
router.post("/login", login);

// AFTER THIS USER MUST BE LOGGED IN

router.use(isAuthenticated);

router.get("/me", getMyProfile);

router.get("/logout", logout);

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

router.get("/allusers/:id", getAllUsers);

module.exports = router;
