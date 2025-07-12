const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

// --------------------
// Public Authentication Routes
// --------------------

/**
 * @route   POST /signup
 * @desc    Register a new user
 */
router.post('/signup', authController.signup);

/**
 * @route   POST /login
 * @desc    Login an existing user
 */
router.post('/login', authController.login);

/**
 * @route   GET /logout
 * @desc    Logs out the user (clears cookie/token)
 */
router.get('/logout', authController.logout);

/**
 * @route   POST /forgotPassword
 * @desc    Initiates password reset (sends token via email)
 */
router.post('/forgotPassword', authController.forgotPassword);

/**
 * @route   PATCH /resetPassword/:token
 * @desc    Resets the password using token sent to email
 */
router.patch('/resetPassword/:token', authController.resetPassword);

/**
 * @route   POST /updatePassword/:id
 * @desc    Manually updates a user’s password (custom method)
 */
router.post('/updatePassword/:id', authController.updatePasswordEasy);

/**
 * @route   GET /check
 * @desc    Check token validity (custom check route)
 */
router.get('/check', authController.check);

// --------------------
// Protected Routes (Authentication Required)
// --------------------

router.use(authController.protect);

/**
 * @route   GET /me
 * @desc    Get current logged-in user's profile
 */
router.get('/me', userController.getMe, userController.getUser);

/**
 * @route   PATCH /updateMyPassword
 * @desc    Update password for current user
 */
router.patch('/updateMyPassword', authController.updatePassword);

/**
 * @route   PATCH /updateMyData
 * @desc    Update current user's profile info (including photo)
 */
router.patch(
  '/updateMyData',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);

/**
 * @route   DELETE /deleteMyData
 * @desc    Soft delete (deactivate) current user
 */
router.delete('/deleteMyData', userController.deleteMe);

// --------------------
// Admin-only Routes (Role: 'admin')
// --------------------

router.use(authController.restrictTo('admin'));

/**
 * @route   GET /           → Get all users
 * @route   POST /          → Create a new user
 */
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

/**
 * @route   GET /:id        → Get a specific user
 * @route   PATCH /:id      → Update user data
 * @route   DELETE /:id     → Delete a user
 */
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
