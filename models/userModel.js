const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const shortid = require("@rh389/shortid");

shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Please enter us your username"],
  },
  name: {
    type: String,
    required: [true, "Please enter us your Agent Code"],
  },
  mobile: {
    type: String,
    required: [true, "Please enter your phone number!"],
    validate: [validator.isMobilePhone, "Please provide a valid mobile"],
  },
  birthday: {
    type: Date,
    validate: [validator.isDate, "Please enter a valid date!"],
  },
  accountNo: {
    type: Number,
    default: 1234567890,
  },
  balance: {
    type: Number,
    default: 0,
  },
  referralId: {
    type: String,
    default: shortid.generate,
    unique: true,
  },
  refId: {
    type: mongoose.Schema.ObjectId,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: String,
  role: {
    type: String,
    enum: ["user", "staff", "suuper"],
    default: "user",
  },
  referredCount: {
    type: Number,
    default: 0,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
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
  level: {
    type: String,
    default: "ROOKIE",
    enum: [
      "ROOKIE",
      "AMATEUR",
      "SENIOR",
      "ENTHUSIAST",
      "PROFESSIONAL",
      "EXPERT",
      "LEADER",
      "MASTER",
      "VETERAN",
      "GENERAL",
      "CONTROLLER",
      "SHAREHOLDER",
    ],
  },
});

userSchema.index({ referredCount: 1, username: 1, shipCode: 1, createdAt: 1 });

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({
    active: {
      $ne: false,
    },
  });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
mongoose.models = {};

module.exports = mongoose.model("User", userSchema);
