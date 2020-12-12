const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    userid: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    mobile: {
      type: String,
      require: true,
    },
    pincode: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    locality: {
      type: String,
      require: true,
    },
    district: {
      type: String,
      require: true,
    },
    state: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Address", schema);
