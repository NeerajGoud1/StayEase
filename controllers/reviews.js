const Listing = require("../models/listing");
const Review = require("../models/reviews");

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review); // the total review content object will be found here which contains rating, content, ...
  newReview.author = req.user._id; // Storing the author with review that is additionally added in schema
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "review added successfully");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "review deleted successfully");
  res.redirect(`/listings/${id}`);
};
