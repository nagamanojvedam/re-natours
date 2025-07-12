const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimiter = require('express-rate-limit');
// const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const AppError = require('./utils/appErrors');

const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const viewRouter = require('./routes/viewRoutes');
const userRouter = require('./routes/userRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const bookingController = require('./controllers/bookingController');

const app = express();
// const __dirname = path.resolve();
// app.enable('trust proxy');

// Defining the view engine
// app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, 'views'));

// Global Middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
}
// app.use(helmet());
app.use(
  '/api',
  rateLimiter({
    max: 1000,
    windowMs: 60 * 60 * 100,
    message: 'Too many requests from this IP, please try again in an hour!',
  }),
);

app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout,
);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
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
app.use(compression());

// Serving Static Files
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', viewRouter);
app.use('/api/v2/tours', tourRouter);
app.use('/api/v2/users', userRouter);
app.use('/api/v2/bookings', bookingRouter);
app.use('/api/v2/reviews', reviewRouter);

app.get('/config/stripe', (req, res) => {
  res.json({ publicKey: process.env.STRIPE_PK });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get(/.*?/, (req, res, next) => {
    res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

app.all('*', (req, res, next) => {
  next(new AppError(404, `Cant find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHandler);

module.exports = app;
