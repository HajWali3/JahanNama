const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createNewReview = async (req, res) => {
  const { id } = req.params;
  let list = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user;
  list.reviews.push(newReview);
  await newReview.save();
  await list.save();
  req.flash("success", "New Review Created!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyRoute = async (req, res) => {
  let { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
