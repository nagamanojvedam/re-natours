/**
 * Wraps asynchronous route handlers and forwards any thrown errors to Express error handling middleware.
 *
 * Usage:
 *   app.get('/route', catchAsync(async (req, res, next) => {
 *     const data = await someAsyncOperation();
 *     res.json(data);
 *   }));
 *
 * This eliminates repetitive try-catch blocks in each async controller function.
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
