const AppError = require('../utils/appErrors');
const catchAsync = require('../utils/catchAsync');
const AppFeatures = require('../utils/apiFeatures');

// GET /api/v1/[resource]?query=params
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // For nested GETs like: GET /tours/:tourId/reviews
    const filter = req.params.tourId ? { tour: req.params.tourId } : {};

    // Chain filtering, sorting, field limiting, and pagination
    const features = new AppFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const documents = await features.query;

    res.status(200).json({
      status: 'success',
      results: documents.length,
      data: {
        data: documents,
      },
    });
  });

// GET /api/v1/[resource]/:id
exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findById(id);

    if (!document) {
      return next(new AppError(404, `No document found with ID: ${id}`));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

// POST /api/v1/[resource]
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

// PATCH /api/v1/[resource]/:id
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndUpdate(id, req.body, {
      new: true, // Return updated document
      runValidators: true, // Run schema validators
    });

    if (!document) {
      return next(new AppError(404, `No document found with ID: ${id}`));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

// DELETE /api/v1/[resource]/:id
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new AppError(404, `No document found with ID: ${id}`));
    }

    res.status(204).json({
      status: 'success',
      message: `${Model.modelName} deleted successfully`,
    });
  });
