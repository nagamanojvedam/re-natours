const AppError = require('../utils/appErrors');

// Handle Mongoose CastError (invalid MongoDB ObjectId, etc.)
const handleCastErrorDB = (err) =>
  new AppError(400, `Invalid ${err.path}: ${err.value}`);

// Handle duplicate field error from MongoDB
const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  return new AppError(
    400,
    `Duplicate field value: ${value}. Please use another value!`,
  );
};

// Handle Mongoose validation errors
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  return new AppError(400, `Invalid input data. ${errors.join('. ')}`);
};

// Handle JWT error (invalid signature)
const handleJWTError = () =>
  new AppError(401, 'Invalid token. Please log in again.');

// Handle JWT expired token
const handleJWTExpiredError = () =>
  new AppError(401, 'Your token has expired. Please log in again.');

// Development error response (more details)
const sendErrorDev = (err, req, res) => {
  // For API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // For rendered website
  return res.status(err.statusCode).status({
    title: 'Something went wrong!',
    msg: err.message,
  });
};

// Production error response (hide internal details)
const sendErrorProd = (err, req, res) => {
  // For API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperationalError) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // Programming/unknown error: don't leak details
    console.error('ERROR 💥', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }

  // For rendered website
  if (err.isOperationalError) {
    return res.status(err.statusCode).json({
      title: 'Something went wrong!',
      msg: err.message,
    });
  }

  // Programming/unknown error
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).json({
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
};

// GLOBAL ERROR MIDDLEWARE FUNCTION
module.exports = (err, req, res, next) => {
  // Default error values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Development environment
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  }

  // Production environment
  else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    // Manually copy message for Mongo/mongoose errors
    error.message = err.message;

    // Handle specific error types
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
