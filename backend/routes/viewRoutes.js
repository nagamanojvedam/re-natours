const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// ----------------------------
// Middleware to show alert messages (e.g., ?alert=booking)
// ----------------------------
router.use(viewController.alerts);

// ----------------------------
// Public Routes (Accessible without login)
// ----------------------------

/**
 * @route   GET /
 * @desc    Homepage: Overview of all tours
 * @access  Public, but detects if user is logged in
 */
router.get(
  '/',
  bookingController.createBookingCheckoutLocal,
  authController.isLoggedIn,
  viewController.getOverview,
);

/**
 * @route   GET /tour/:slug
 * @desc    Details of a specific tour
 * @access  Public, but adapts if user is logged in
 */
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);

/**
 * @route   GET /login
 * @desc    Login form page
 * @access  Public
 */
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);

/**
 * @route   GET /signup
 * @desc    Signup form page
 * @access  Public
 */
router.get('/signup', viewController.getSignupForm);

// ----------------------------
// Protected Routes (Login required)
// ----------------------------

/**
 * @route   GET /me
 * @desc    Account settings page for logged-in user
 */
router.get('/me', authController.protect, viewController.getAccount);

/**
 * @route   GET /bookings
 * @desc    Bookings page for logged-in user
 */
router.get('/bookings', authController.protect, viewController.getMyBookings);

/**
 * @route   POST /submit-user-data
 * @desc    Update user data (name, email) via form submission
 */
router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData,
);

module.exports = router;
