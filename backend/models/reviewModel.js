const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A review must contain text.'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must be associated with a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must be written by a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// -------------------------------------------------------------
// Enforce one review per user per tour (prevent duplicates)
// -------------------------------------------------------------
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// -------------------------------------------------------------
// Populate user info automatically on find queries
// -------------------------------------------------------------
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// -------------------------------------------------------------
// Calculate and update average ratings for a tour
// -------------------------------------------------------------
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].averageRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5, // default fallback
    });
  }
};

// -------------------------------------------------------------
// Hook: After saving a new review
// -------------------------------------------------------------
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

// -------------------------------------------------------------
// Hook: Before update/delete - get current doc
// -------------------------------------------------------------
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.doc = await this.findOne();
  next();
});

// -------------------------------------------------------------
// Hook: After update/delete - recalculate rating
// -------------------------------------------------------------
reviewSchema.post(/^findOneAnd/, async function () {
  if (this.doc) {
    await this.doc.constructor.calcAverageRatings(this.doc.tour);
  }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
