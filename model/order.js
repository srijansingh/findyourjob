const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    userid: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      require: true,
    },
    orderid: {
      type: String,
      require: true,
    },
    items: {
      type: Array,
      require: true,
    },
    totalamount: {
      type: String,
      require: true,
    },
    totalitems: {
      type: String,
      require: true,
    },
    address: {
      type: Object,
      require: true,
    },
    date: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      default: "processing",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", schema);
