const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const { category } = req.query;
  const { search } = req.query.listing || {};
  let filter = {};

  if (category) {
    filter.category = { $in: [category] }; // Ensure it checks if category exists in array
  }

  if (search) {
    filter.$or = [
      { title: new RegExp(search, "i") }, // Case-insensitive title match
      { location: new RegExp(search, "i") }, // Case-insensitive location match
    ];
  }

  // Fetch listings based on the filter
  const allListings = await Listing.find(filter);
  // res.render("listings/index", { allListings });
  res.render("listings/index", { allListings, currUser: req.session.currUser });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  const currUser = req.user;
  if (!list) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show", { list, currUser });
};

module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  let savedListing = await newListing.save();
  console.log(savedListing);

  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }

  let orignalUrl = list.image.url;
  orignalUrl.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/update", { list, orignalUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  // let listing = await Listing.findOneAndUpdate(
  //   { _id: id },
  //   { $set: req.body.listing }
  // );
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
