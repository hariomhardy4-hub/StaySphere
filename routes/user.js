const express = require("express");
const router = express.Router();
const User = require("../Models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
let passport = require("passport");
const { saveRedirectUrl} = require("../middleware.js");
const userController = require("../controller/users.js");

router
.route("/signup")
.get(userController.renderSignupForm)
.post( wrapAsync(userController.signup)
)

router.route("/login")
.get(userController.renderLoginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true}), 
        userController.login);

// edit mein bhi post to yhi se hoga listing kyu ki authenticate hoga edit wala listing bhi

router.get("/logout",userController.logout);

module.exports = router;