const mongoose = require("mongoose");
const mealType = require("../_helpers/meals.js");

const Schema = mongoose.Schema;

const orderTraffic = new Schema(
  {
    name: {
        type: Schema.Types.String,
        required: true
    },
    price: {
      type: Schema.Types.Number,
      required: false
    },
    type: {
      type: mealType,
      required: true
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
