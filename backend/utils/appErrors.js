class AppError extends Error {
  constructor(statusCode, message) {
    super(message);

    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Captures stack trace excluding constructor call
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
