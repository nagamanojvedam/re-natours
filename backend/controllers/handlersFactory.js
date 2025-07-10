const AppError = require('../utils/appErrors');
const catchAsync = require('../utils/catchAsync');
const AppFeatures = require('../utils/apiFeatures');

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // Filters
    const filter = req.params.tourId ? { tour: req.params.tourId } : {};

    const features = new AppFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const document = await features.query;

    res.status(200).json({
      status: 'success',
      results: document.length,
      data: {
        data: document,
      },
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findById(id);

    if (!document)
      return next(
        new AppError(404, `Cannot find the document with that ${id}`),
      );

    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { body: data } = req;

    const document = await Model.create(data);

    res.status(201).json({
      status: 'success',
      data: { data: document },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { body: data } = req;

    const document = await Model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!document)
      return next(
        new AppError(404, `Cannot find the document with that ${id}`),
      );

    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document)
      return next(
        new AppError(404, `Cannot find the document with that ${id}`),
      );

    res.status(204).json({
      status: 'success',
      message: 'Tour deleted successfully',
    });
  });
