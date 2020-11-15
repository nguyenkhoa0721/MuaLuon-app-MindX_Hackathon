const mongoose = require("mongoose");

const Items = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Item must have a name"],
    trim: true,
  },
  number: {
    type: Number,
    required: [true, "Number of items must be specify"],
  },
  price: {
    type: Number,
    required: [true, "You must specify the price of one item"],
  },
});

const Discounts = new mongoose.Schema({
  percentage: {
    type: Number,
    required: [
      true,
      "You must specify how many percentages you want to discount",
    ],
  },
  discountInfo: {
    type: String,
    trim: true,
  },
});

const billSchema = new mongoose.Schema(
  {
    seller: {
      required: [true, "A bill must belong to a seller"],
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    buyer: {
      required: [true, "A bill must belong to a buyer"],
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    status: {
      type: Number,
    },
    items: [Items],
    chargeInfo: {
      totalPrice: {
        type: Number,
        required: [true, "Total price is required"],
      },
      totalDiscount: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

billSchema.virtual("buyerInfo", {
  ref: "user",
  localField: "buyer",
  foreignField: "_id",
});

billSchema.virtual("sellerInfo", {
  ref: "user",
  localField: "seller",
  foreignField: "_id",
});

billSchema.pre(/^find/, function (next) {
  this.populate({
    path: "buyerInfo",
    options: {
      select:
        "-password -changePasswordAt -passwordResetToken -passwordResetExpires",
    },
  }).populate({
    path: "sellerInfo",
    options: {
      select:
        "-password -changePasswordAt -passwordResetToken -passwordResetExpires",
    },
  });
  next();
});

const Bill = mongoose.model("Bill", billSchema);

module.exports = Bill;
