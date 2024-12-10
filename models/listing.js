const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  image: {
    url: String,
    filename: String,
  },

  price: {
    type: Number,
  },

  location: {
    type: String,
  },

  country: {
    type: String,
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  Category: {
    type: String, //[String] to assign multiple values
    enum: [
      "mountains",
      "rooms",
      "trending",
      "iconic city",
      "beach",
      "amazing pool",
      "camping",
      "farm",
      "arctic",
    ],
  },
});

//post mongoose middleware that is used to delete all reviews when a perticular listing is deleted.
ListingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", ListingSchema);

module.exports = Listing;
