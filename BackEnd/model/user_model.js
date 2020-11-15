const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const changeTimestamp = require("./../utils/changetimestamp");
const { stringify } = require("querystring");

const Goods = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A good must have a name"],
  },
  price: {
    type: Number,
    required: [true, "A good must have a price"],
  },
  image: {
    type: String,
    default: "hinh.png",
  },
});

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: {
      values: ["buyer", "seller"],
      message: "Role must be either buyer or seller",
    },
    required: [true, "A user must have a role"],
  },
  username: {
    type: String,
    lowercase: true,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z0-9]+$/, "is invalid"],
    index: true,
    unique: true,
  },
  phone: String,
  name: {
    type: String,
    required: [true, "name required"],
  },
  email: {
    type: String,
    required: [true, "email required"],
    unique: true,
    lowercase: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  birth: Date,
  avt: {
    type: String,
    required: true,
  },
  goods: [Goods],
  bio: String,
  job: String,
  address: String,
  shopAddress: {
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
    },
    coordinates: [Number],
    address: String,
  },
  gender: String,
  changePasswordAt: Date,
  passwordResetToken: String,
  passwordResetExpries: Date,
});
userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

userSchema.virtual("sellerBills", {
  ref: "Bill",
  localField: "_id",
  foreignField: "seller",
});

userSchema.virtual("buyerBills", {
  ref: "Bill",
  localField: "_id",
  foreignField: "buyer",
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.changePasswordAt = Date.now() - 1000;
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = await crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = await crypto
    .createHash("HS256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpries = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const user = mongoose.model("user", userSchema);
module.exports = user;
