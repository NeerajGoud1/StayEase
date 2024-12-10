const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAysnc.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingCountroller = require("../controllers/listing.js");

const multer = require("multer");
const { storage } = require("../cloudeConfig.js");
const upload = multer({ storage }); //it automatically uplodes at image at specified path

//index route and create route
router
  .route("/")
  .get(wrapAsync(listingCountroller.index)) //usage of router.route()
  .post(
    isLoggedIn,
    upload.single("listing[image]"), //where actual image parsing is done that comes from browser
    validateListing,
    wrapAsync(listingCountroller.createListing)
  );

//renders new route
router.get("/new", isLoggedIn, listingCountroller.renderNewForm);

//get is show route / put is update route
router
  .route("/:id")
  .get(wrapAsync(listingCountroller.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"), // after parsing only we will validate listing
    validateListing,
    wrapAsync(listingCountroller.updateListitng)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingCountroller.deleteListing));

//edit route renders edit form
router.get("/:id/edit", isLoggedIn, isOwner, listingCountroller.renderEditForm);

module.exports = router;
