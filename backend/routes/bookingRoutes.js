const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

// Protect all routes below this middleware
router.use(authController.protect);

/**
 * @route   GET /checkout-session/:tourId
 * @desc    Create Stripe checkout session for a tour
 * @access  Protected (Logged-in users)
 */
router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

// Restrict routes below to 'admin' and 'lead-guide' only
router.use(authController.restrictTo('admin', 'lead-guide'));

/**
 * @route   GET /           → Get all bookings
 * @route   POST /          → Create a booking
 */
router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

/**
 * @route   GET /:id        → Get a specific booking
 * @route   PATCH /:id      → Update a booking
 * @route   DELETE /:id     → Delete a booking
 */
router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
