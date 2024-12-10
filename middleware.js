const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/reviews.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; //storing the url info to redirect to that perticular page form where user redirected to login page. to do that we are saving the url at session object hence session object can be accesed by any route.
    req.flash("error", "You must be logged in to create listing");
    return res.redirect("/login");
  }
  next();
};

//but there is a problem with req.session when user logged in after authentication session object will be reseted that means it deletes the redirectUrl from session object bca it is newly added key.
//to avoid this we are storing it in locals if and only if the session has redirectUrl -- that means user redirected to login page when clicked on some option and after login user should redirect to that page itself
module.exports.saveRedirectedUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  //checks for authorization at route level when user trys to delete or edit a listing
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.curUser._id)) {
    req.flash("error", "You are not Owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//validatation middleware
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  console.log(error);
  if (error) {
    let errMsg = error.details.map((ele) => ele.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//Server side validation for reviews
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  console.log(error);
  if (error) {
    let errMsg = error.details.map((ele) => ele.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  //checks for authorization
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.curUser._id)) {
    req.flash("error", "You are not author of this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
