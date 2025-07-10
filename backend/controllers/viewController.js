const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appErrors');

const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', { title: 'All tours', tours });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', { title: `Login to your account` });
};

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert =
      "Your booking was successfull! Please check your email for confirmation. If your booking does't show up here immediately, please come back later.";

  next();
};

exports.getAccount = (req, res, next) => {
  res.status(200).render('account', { title: 'Your Account' });
};

exports.getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });

  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', { title: 'My Tours', tours });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
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

  res
    .status(200)
    .render('account', { title: 'Your Account', user: updatedUser });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) return next(new AppError(404, 'There is no such tour'));

  res.status(200).render('tour', { title: `${tour.name} Tour`, tour });
});

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', { title: 'Sign up to Natours' });
};
