const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  let allData = await Listing.find();
  res.render("./listing/index.ejs", {
    allData,
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listing/new.ejs");
};

module.exports.createListing = async (req, res) => {
  // if (!req.body.listing) {
  //   //error triggered if no data is received from client
  //   throw new ExpressError(400, "Send valid data for listing"); //our custom error. we can define custom errror where we feel like "Here may generate error".
  // }
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; //here from form we are providing all the details but not username to do that we should store user id
  newListing.image = { url, filename };

  //passport automatically stores user related info in req
  await newListing.save();
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  // console.log(listing);

  if (!listing) {
    req.flash("error", "Listing not found!");
    res.redirect("/listings");
  }
  res.render("listing/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    res.redirect("/listings");
  }
  let pixelreducedImage = listing.image.url;
  pixelreducedImage = pixelreducedImage.replace("/upload", "/upload/w_250");
  res.render("listing/edit.ejs", { listing, pixelreducedImage });
};

module.exports.updateListitng = async (req, res) => {
  let { id } = req.params;
  // console.log({...req.body.listing});
  let listing = await Listing.findByIdAndUpdate(id, req.body.listing);
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  //  req.body.listing = {...req.body.listing} here you have made an object named listing at name = "listing[]" and the submited data from the form will be store at listing object as name:value pair and here we are accessing it req.body.listing(obj name)
  req.flash("success", "Listing Edited ");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully");
  res.redirect("/listings");
};
