const express = require("express");
const router = express.Router();
const PostController = require("../controllers/PostController");
const { authentication, isAuthor, isAdmin } = require("../middlewares/authentication");
const { uploadUserPostsImages } = require('../middlewares/multer');

router.post("/", authentication, PostController.create);
router.get("/", PostController.getAll);
router.get("/id/:_id", PostController.getById);
router.get("/name/:username", PostController.getPostsByUserName);
router.get("/search/:title", PostController.getPostsByName);
router.delete("/id/:_id", authentication, isAuthor, PostController.delete);
router.put("/:_id", authentication, uploadUserPostsImages.single('image'), isAuthor, PostController.update);
router.put("/comments/:_id", authentication, PostController.insertComment);
router.put("/like/:_id", authentication, PostController.like);
router.put("/dislike/:_id", authentication, PostController.dislike);

module.exports = router;
