if (process.env.NODE_ENV != "production") {
  //only use .env file if we are not under the development phase
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
const ExpressError = require("./utils/ExpressError.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const Localstrategy = require("passport-local");
const User = require("./models/user.js");

app.use(cookieParser("secreat"));

//routes that are created separately
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { parseArgs } = require("util");

app.use(express.static(path.join(__dirname, "/public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true })); //for data parsing

const atlasDbUrl = process.env.ATLASDB_URL;
async function main() {
  try {
    await mongoose.connect(atlasDbUrl);
    console.log("connected to db sucessfully");
  } catch (err) {
    console.log(err);
  }
}

main();

let store = MongoStore.create({
  mongoUrl: atlasDbUrl,
  crypto: {
    secret: process.env.SECRET, //we can specify normally also but it adds some encription
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR in MONGO SESSION  STORE", err);
});

const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  coookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); //to initialize the passport and this is must and should to use passport
app.use(passport.session()); //this ensures that a user is recognized even if navigates to different tabs in same web browser and dont asks for frequent login
passport.use(new Localstrategy(User.authenticate())); // means inside passport we are using passportLocal/Localstrategy to authenticate a user using a method called authenticate()
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curUser = req.user;
  next();
});

app.use("/listings", listingRouter); //these two routes restructed and all routes are separated at another files (routes) to look code more clean
app.use("/listings/:id/review", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

//error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("listing/error.ejs", { message });
});

app.listen(8080, () => {
  console.log("server is listening at port 8080");
});
