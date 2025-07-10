const handlersFactory = require('./handlersFactory');

const Review = require('../models/reviewModel');

exports.getAllReviews = handlersFactory.getAll(Review);
exports.getReview = handlersFactory.getOne(Review);
exports.createReview = handlersFactory.createOne(Review);
exports.updateReview = handlersFactory.updateOne(Review);
exports.deleteReview = handlersFactory.deleteOne(Review);

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
