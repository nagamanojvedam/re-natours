const handlersFactory = require('./handlersFactory');
const Review = require('../models/reviewModel');

// Reuse factory functions for CRUD operations
exports.getAllReviews = handlersFactory.getAll(Review);
exports.getReview = handlersFactory.getOne(Review);
exports.createReview = handlersFactory.createOne(Review);
exports.updateReview = handlersFactory.updateOne(Review);
exports.deleteReview = handlersFactory.deleteOne(Review);

/**
 * Middleware to auto-fill `tour` and `user` fields for nested POST routes
 * e.g., POST /tours/:tourId/reviews
 */
exports.setTourUserIds = (req, res, next) => {
  // If no `tour` in body, take it from URL
  if (!req.body.tour) req.body.tour = req.params.tourId;

  // If no `user` in body, take it from authenticated user
  if (!req.body.user) req.body.user = req.user.id;

  next();
};
