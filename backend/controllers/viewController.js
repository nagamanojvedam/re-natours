const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appErrors');

const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');

/* ========================================
   ALERT MIDDLEWARE
======================================== */
exports.alerts = (req, res, next) => {
  const { alert } = req.query;

  if (alert === 'booking') {
    res.locals.alert =
      "Your booking was successful! Please check your email for confirmation. If it doesn't show up immediately, please check again later.";
  }

  next();
};

/* ========================================
   PAGES
======================================== */

// Overview of all tours
exports.getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

// Single tour page
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) return next(new AppError(404, 'There is no such tour'));

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

// Login form
exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login to your account',
  });
};

// Signup form
exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign up to Natours',
  });
};

// Account page
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account',
  });
};

// My bookings (dashboard view)
exports.getMyBookings = catchAsync(async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id });

  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

// Update user data from form submission
exports.updateUserData = catchAsync(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).render('account', {
    title: 'Your Account',
    user: updatedUser,
  });
});
