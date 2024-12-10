const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAysnc");
const passport = require("passport");
const { saveRedirectedUrl } = require("../middleware");
const userController = require("../controllers/user");

router
  .route("/signup")
  .get(userController.renderSignUpPage)
  .post(wrapAsync(userController.SignUp));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectedUrl, //just before authentication we need to store the redirectUrl in locals bez session obj will be reseted after authentication
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }), //authoenticate is a middleware to verify wheather a user exist or not if not exist it redirests to failureRedirects value
    wrapAsync(userController.Login)
  );

//logout
router.get("/logout", userController.logout);

module.exports = router;
