const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

/**
 * If this router is used under a nested route (e.g. /tours/:tourId/reviews),
 * `mergeParams: true` allows access to `req.params.tourId` inside controller.
 */

// Public access: Get all reviews
router.route('/').get(reviewController.getAllReviews);

// Protect all routes below
router.use(authController.protect);

/**
 * @route   POST /
 * @desc    Create a review (only logged-in users with role 'user')
 * @access  Protected
 */
router.post(
  '/',
  authController.restrictTo('user'),
  reviewController.setTourUserIds,
  reviewController.createReview,
);

/**
 * @route   GET /:id         → Get a specific review
 * @route   PATCH /:id       → Update a review
 * @route   DELETE /:id      → Delete a review
 * @access  Protected, 'admin' or same 'user'
 */
router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('admin', 'user'),
    reviewController.updateReview,
  )
  .delete(
    authController.restrictTo('admin', 'user'),
    reviewController.deleteReview,
  );

module.exports = router;
