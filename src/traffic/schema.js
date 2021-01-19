const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderTraffic = new Schema(
  {
    billId: {
        type: Schema.Types.String,
        required: true
    },
    meals: {
      type: Schema.Types.Mixed,
      required: true,
      default: 1
    },
    finished_timestamp: {
      type: Schema.Types.Number,
      required: true,
      default: 0
    },
  },
  { collection: "orderTraffics" }
);

module.exports = mongoose.model("orderTraffic", orderTraffic);
