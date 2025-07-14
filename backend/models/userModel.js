const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide a valid email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Invalid email format'],
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    role: {
      type: String,
      enum: ['user', 'guide', 'lead-guide', 'admin'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false, // Prevents password from being sent in API responses
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // Works only on .save() and .create()
        validator: function (val) {
          return val === this.password;
        },
        message: 'Passwords do not match',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ------------------------------------
// Middleware: Encrypt password before saving
// ------------------------------------
userSchema.pre('save', async function (next) {
  // Run only if password was modified
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; // Remove from DB
  next();
});

// ------------------------------------
// Middleware: Set passwordChangedAt for token invalidation
// ------------------------------------
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  // Set slightly earlier to avoid JWT timing issues
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// ------------------------------------
// Middleware: Exclude inactive users from all find queries
// ------------------------------------
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// ------------------------------------
// Instance Method: Compare entered password with hashed password
// ------------------------------------
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// ------------------------------------
// Instance Method: Check if password was changed after token was issued
// ------------------------------------
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// ------------------------------------
// Instance Method: Generate password reset token
// ------------------------------------
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Save hashed version in DB (never the raw token)
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 min
  return resetToken; // This raw token will be sent to user via email
};

const User = mongoose.model('User', userSchema);
module.exports = User;
