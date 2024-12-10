const User = require("../models/user");

module.exports.renderSignUpPage = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.SignUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    let regUser = await User.register(newUser, password); //automatically stores into database

    req.login(regUser, (err) => {
      //automatically login with signUp
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Stayease!");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.Login = async (req, res) => {
  //this is not actually a login login it is performed after sucessful login. actual login and authentication is done by passport.
  req.flash("success", "Welcome back to Stayease!");
  if (res.locals.redirectUrl) {
    //sometimes normal manual login is done in that case we need to redirect to listings page
    //when we click on something that needs login for user then only isLoggedIn funtriggered and in session object redirectUrl is saved
    res.redirect(res.locals.redirectUrl);
  } else {
    res.redirect("/listings");
  }
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    //it will use deserialize method for removing session informatuon
    if (err) {
      next(err);
    } else {
      req.flash("success", "You are logged out!");
      res.redirect("/listings");
    }
  });
};
