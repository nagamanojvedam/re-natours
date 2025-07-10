const multer = require('multer');
const sharp = require('sharp');

const handlersFactory = require('./handlersFactory');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appErrors');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((key) => {
    // if (allowedFields.includes(key) && obj[key] !== 'undefined')
    if (allowedFields.includes(key)) newObj[key] = obj[key];
  });

  return newObj;
};

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError(404, 'Not an image! Please upload only images'), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'failed',
    message: 'createUser route is not defined! Please use /signup instead',
  });
};
exports.getAllUsers = handlersFactory.getAll(User);
exports.getUser = handlersFactory.getOne(User);
exports.updateUser = handlersFactory.updateOne(User);
exports.deleteUser = handlersFactory.deleteOne(User);

// exports.getMe = catchAsync(async (req, res, next) => {
//   const user = await User.findById(req.user.id);

//   if (!user) return next(new AppError(404, 'User not found'));

//   res.status(200).json({
//     status: 'success',
//     data: {
//       user,
//     },
//   });
// });

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        400,
        'Cannot change password with this route, please use /updatePassword',
      ),
    );

  const filterdBody = filterObj(req.body, 'name', 'email', 'photo');

  console.log(filterdBody);

  if (req.file) filterdBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterdBody, {
    new: true,
    runValidatorus: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
