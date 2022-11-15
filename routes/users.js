const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { authentication } = require("../middlewares/authentication");

router.post("/", UserController.create);
router.post('/loginuser',UserController.login);
router.delete('/logout',authentication, UserController.logout)
router.get("/loggedIn", authentication, UserController.loggedIn);

module.exports = router;