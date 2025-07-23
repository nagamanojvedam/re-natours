const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appErrors');
const Email = require('../utils/email'); // Optional for production
const User = require('../models/userModel');

const frontendUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://re-natours.onrender.com'
    : 'http://localhost:5173';

// ----------------------------------------
// Utility: Sign JWT Token
// ----------------------------------------
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// ----------------------------------------
// Utility: Send JWT in cookie + response
// ----------------------------------------
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

// ----------------------------------------
// Signup Controller
// ----------------------------------------
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const url = `${frontendUrl}/me`;

  await new Email(newUser, url).sendWelcome();
  createSendToken(newUser, 201, req, res);
});

// ----------------------------------------
// Login Controller
// ----------------------------------------
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError(400, 'Please provide email and password'));
  }

  const user = await User.findOne({ email }).select('+password');
  const correct = user && (await user.correctPassword(password, user.password));

  if (!correct) {
    return next(new AppError(401, 'Incorrect email or password'));
  }

  createSendToken(user, 200, req, res);
});

// ----------------------------------------
// Logout Controller
// ----------------------------------------
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: 'success' });
};

// ----------------------------------------
// Forgot Password Controller
// ----------------------------------------
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError(404, 'No user found with that email'));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${frontendUrl}/reset-password/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError(500, 'Failed to send email. Try again later.'));
  }
});

// ----------------------------------------
// Reset Password Controller
// ----------------------------------------
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError(400, 'Token is invalid or expired'));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  createSendToken(user, 200, req, res);
});

// ----------------------------------------
// Middleware: Protect Routes
// ----------------------------------------
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1. Get token from header or cookie
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // 2. Ensure token exists
  if (!token) {
    return next(
      new AppError(401, 'You are not logged in! Please log in to access.'),
    );
  }

  // 3. Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 4. Check user existence
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError(401, 'User no longer exists.'));
  }

  // 5. Check if password changed after token issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(401, 'Password recently changed. Please login again.'),
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// ----------------------------------------
// Middleware: Role-Based Access
// ----------------------------------------
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(403, 'You do not have permission to perform this action'),
      );
    }
    next();
  };
};

// ----------------------------------------
// Update Password (with old password check)
// ----------------------------------------
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError(401, 'Your current password is incorrect'));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, req, res);
});

// ----------------------------------------
// Admin-only Password Update (no old password required)
// ----------------------------------------
exports.updatePasswordEasy = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError(404, 'User not found'));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  res.status(200).json({ status: 'success' });
});

// ----------------------------------------
// Middleware: For Views - Check if User is Logged In
// ----------------------------------------
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      const currentUser = await User.findById(decoded.id);
      if (!currentUser || currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

// ----------------------------------------
// API Helper: Return Authenticated User (used on frontend check)
// ----------------------------------------
exports.check = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(200).json({ user: null });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) return res.status(200).json({ user: null });

    res.status(200).json({ user });
  } catch {
    res.status(200).json({ user: null });
  }
};
