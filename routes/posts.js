const express = require("express");
const router = express.Router();
const PostController = require("../controllers/PostController");
const { authentication } = require("../middlewares/authentication");

router.post("/",authentication, PostController.create);
router.get("/", PostController.getAll);
router.get("/id/:_id", PostController.getById);
router.get("/name/:username", PostController.getPostsByUserName);
router.delete('/id/:_id', authentication, PostController.delete);
router.put("/id/:_id",authentication, PostController.update);
router.put("/insertComment/:_id", authentication, PostController.insertComment);
router.put("/like/:_id", authentication, PostController.like);
router.put("/dislike/:_id", authentication, PostController.dislike);

module.exports = router;