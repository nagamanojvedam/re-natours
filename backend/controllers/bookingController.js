const stripe = require('stripe')(process.env.STRIPE_SK);
const catchAsync = require('../utils/catchAsync');
const handlersFactory = require('./handlersFactory');

const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appErrors');

const frontendUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://natours.onrender.com'
    : 'http://localhost:5173';

const endPointSecret =
  process.env.NODE_ENV === 'production'
    ? process.env.STRIPE_WEBHOOK_SECRET
    : process.env.STRIPE_WEBHOOK_SECRET_LOCAL;
// ---------------------------------------------------
// Reusable CRUD Operations
// ---------------------------------------------------
exports.getAllBookings = handlersFactory.getAll(Booking);
exports.getBooking = handlersFactory.getOne(Booking);
exports.createBooking = handlersFactory.createOne(Booking);
exports.updateBooking = handlersFactory.updateOne(Booking);
exports.deleteBooking = handlersFactory.deleteOne(Booking);

// ---------------------------------------------------
// Stripe Checkout Session
// Creates a Stripe session and returns it to frontend
// ---------------------------------------------------
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);
  if (!tour) return next(new AppError(404, 'Tour not found'));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${frontendUrl}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${frontendUrl}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(tour.price * 100), // Stripe expects cents
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`${frontendUrl}/img/tours/${tour.imageCover}`],
          },
        },
        quantity: 1,
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    session,
  });
});

// ---------------------------------------------------
// Local Booking Creation After Payment
// Used only for development/local testing (not secure)
// ---------------------------------------------------
exports.createBookingCheckoutLocal = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;
  if (!tour || !user || !price) return next(); // Ignore if params are missing

  await Booking.create({ tour, user, price });

  // Redirect to bookings page
  res.redirect('/bookings?alert=booking');
});

// ---------------------------------------------------
// Stripe Webhook Booking Creation
// More secure - triggered from Stripe's backend
// ---------------------------------------------------
const createBookingCheckout = async (session) => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.amount_total / 100; // Stripe stores in cents

  await Booking.create({ tour, user, price });
};

// Stripe webhook handler (used in server.js as a raw middleware)
exports.webhookCheckout = (req, res, next) => {
  console.log('📥 Webhook route hit');

  const signature = req.headers['stripe-signature'];
  let event;

  console.log('✅ Stripe Webhook Body:', req.body);

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, endPointSecret);
  } catch (err) {
    console.log('❌ Stripe Webhook Error:', err.message);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  console.log('✅ Stripe Event:', event);

  if (event.type === 'checkout.session.completed') {
    createBookingCheckout(event.data.object);
  }

  return res.status(200).json({ received: true });
};
