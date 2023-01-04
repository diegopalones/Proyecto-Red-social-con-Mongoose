const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { authentication } = require("../middlewares/authentication");
const { uploadUserPostsImages } = require('../middlewares/multer');

router.post("/", uploadUserPostsImages.single('image'), UserController.create);
router.post("/loginuser", UserController.login);
router.get("/confirm/:email", UserController.confirm);
router.delete("/logout", authentication, UserController.logout);
router.get("/getinfo", authentication, UserController.getInfo);
router.put("/follow/:_id", authentication, UserController.follow);
router.put("/unfollow/:_id", authentication, UserController.unFollow);

module.exports = router;