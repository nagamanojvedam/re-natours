// Core Modules
const path = require('path');

// External Packages
const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimiter = require('express-rate-limit');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Config
dotenv.config({ path: './config.env' });

// Utils & Controllers
const AppError = require('./utils/appErrors');
const globalErrorHandler = require('./controllers/errorController');
const bookingController = require('./controllers/bookingController');

// Routers
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const reviewRouter = require('./routes/reviewRoutes');
// const viewRouter = require('./routes/viewRoutes');

// Express App Initialization
const app = express();

// -----------------------------
// Middleware Configuration
// -----------------------------

// Enable CORS in development
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
}

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate Limiting
app.use(
  '/api',
  rateLimiter({
    max: 1000,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many requests from this IP, please try again in an hour!',
  }),
);

// Stripe Webhook (must be raw before body parsing)
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout,
);

// Body Parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Cookie Parser
app.use(cookieParser());

// Data Sanitization
app.use(mongoSanitize());
app.use(xss());

// Parameter Pollution Prevention
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// Response Compression
app.use(compression());

// -----------------------------
// API Routes
// -----------------------------

app.use('/api/v2/tours', tourRouter);
app.use('/api/v2/users', userRouter);
app.use('/api/v2/bookings', bookingRouter);
app.use('/api/v2/reviews', reviewRouter);

// Stripe Config Route
app.get('/config/stripe', (req, res) => {
  res.json({ publicKey: process.env.STRIPE_PK });
});

// Frontend Deployment (Production Only)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

// Catch-all Route for Unhandled Requests
app.all('*', (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
