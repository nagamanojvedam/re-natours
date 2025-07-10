const AppError = require('../utils/appErrors');

const handleCastErrorDB = (error) =>
  new AppError(400, `Invalid ${error.path}: ${error.value}`);

const handleDuplicateFieldsDB = (error) => {
  const value = error.message.match(/(["'])(\\?.)*?\1/)[0];

  return new AppError(
    400,
    `Duplicate field value: { tour: ${value} }. Please use another value!`,
  );
};
const handleValidationErrorDB = (error) => {
  const errors = Object.values(error.errors).map((el) => el.message);

  return new AppError(400, `Invalid input data. ${errors.join('. ')}`);
};
const handleJWTError = () =>
  new AppError(401, 'Invalid token. Please log in again');

const handleJWTExpiredError = () =>
  new AppError(401, 'Your token has expired, please login again');

const sendErrorDev = (err, req, res) => {
  // For API
  if (req.originalUrl.startsWith('/api'))
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });

  // For Frontend
  return res
    .status(err.statusCode)
    .render('error', { title: 'Something went wrong!', msg: err.message });
};

const sendErrorProd = (err, req, res) => {
  // For Api
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperationalError) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    return res.status('Error 💥', err).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }

  // For Frontend
  if (err.isOperationalError) {
    return res.status(err.statusCode).render('error', {
      title: 'Please try again later',
      msg: `${err.message}`,
    });
  }

  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') sendErrorDev(err, req, res);

  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
