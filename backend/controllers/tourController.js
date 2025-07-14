const multer = require('multer');
const sharp = require('sharp');

const handlersFactory = require('./handlersFactory');
const AppError = require('../utils/appErrors');
const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/tourModel');

// MULTER CONFIGURATION
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError(404, 'Not an image! Please upload only images'));
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  // Cover Image
  const timestamp = Date.now();
  req.body.imageCover = `tour-${req.params.id}-${timestamp}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // Additional Images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${timestamp}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    }),
  );

  next();
});

// ALIASING
exports.aliasTopTours = (req, res, next) => {
  req.query = {
    limit: '5',
    sort: 'price,-ratingsAverage',
    fields: 'name,price,ratingsAverage,summary,difficulty',
  };
  next();
};

// HANDLER FACTORY WRAPPERS
exports.getAllTours = handlersFactory.getAll(Tour);
exports.getTour = handlersFactory.getOne(Tour);
exports.createTour = handlersFactory.createOne(Tour);
exports.updateTour = handlersFactory.updateOne(Tour);
exports.deleteTour = handlersFactory.deleteOne(Tour);

// AGGREGATIONS
exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsAverage' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    { $sort: { avgPrice: 1 } },
  ]);

  res
    .status(200)
    .json({ status: 'success', results: stats.length, data: { stats } });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = +req.params.year;
  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    { $addFields: { month: '$_id' } },
    { $project: { _id: 0 } },
    { $sort: { numTourStarts: -1 } },
  ]);

  res
    .status(200)
    .json({ status: 'success', results: plan.length, data: { plan } });
});

// GEO QUERIES
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  if (!lat || !lng)
    return next(
      new AppError(
        400,
        'Please provide latitude and longitude in the format lat,lng',
      ),
    );

  const radius = distance / (unit === 'mi' ? 3963.2 : 6378.1);

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[+lng, +lat], radius] } },
  });

  res
    .status(200)
    .json({ status: 'success', results: tours.length, data: { tours } });
});

exports.getDistance = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  if (!lat || !lng)
    return next(
      new AppError(
        400,
        'Please provide latitude and longitude in the format lat,lng',
      ),
    );

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [+lng, +lat] },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    { $project: { distance: 1, name: 1 } },
  ]);

  res.status(200).json({ status: 'success', data: { distances } });
});
