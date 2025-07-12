const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

/**
 * Mount the review router on nested routes like:
 * /tours/:tourId/reviews
 */
router.use('/:tourId/reviews', reviewRouter);

// ------------------------
// Special Aggregation Routes
// ------------------------

/**
 * @route   GET /top-5-tours
 * @desc    Get top 5 cheap and highly rated tours
 * @access  Public
 */
router
  .route('/top-5-tours')
  .get(tourController.aliasTopTours, tourController.getAllTours);

/**
 * @route   GET /tour-stats
 * @desc    Tour statistics aggregated using MongoDB
 * @access  Public
 */
router.route('/tour-stats').get(tourController.getTourStats);

/**
 * @route   GET /monthly-plan/:year
 * @desc    Monthly plan for a specific year
 * @access  Protected (admin, lead-guide, guide)
 */
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan,
  );

// ------------------------
// GeoSpatial Routes
// ------------------------

/**
 * @route   GET /tours-within/distance/:distance/center/:latlng/unit/:unit
 * @desc    Get all tours within a certain distance
 * @access  Public
 */
router
  .route('/tours-within/distance/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

/**
 * @route   GET /distances/:latlng/unit/:unit
 * @desc    Get distances from a given point to all tours
 * @access  Public
 */
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistance);

// ------------------------
// Standard CRUD Routes
// ------------------------

/**
 * @route   GET /         → Get all tours
 * @route   POST /        → Create a new tour (admin, lead-guide only)
 */
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour,
  );

/**
 * @route   GET /:id      → Get tour by ID
 * @route   PATCH /:id    → Update tour (with image upload/resizing)
 * @route   DELETE /:id   → Delete tour (admin, lead-guide only)
 */
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = router;
