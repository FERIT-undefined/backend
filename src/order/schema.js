const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tableOrder = new Schema(
  {
    table: {
      type: Schema.Types.Number,
      required: true
    },
    meals: {
      type: Schema.Types.Mixed,
      required: false
    },
    total_price: {
      type: Schema.Types.Number,
      required: false
    },
    created_timestamp: {
      type: Schema.Types.Number,
      required: true,
      default: 0
    },
    isFinished: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  { collection: "tableOrders" }
);

module.exports = mongoose.model("tableOrder", tableOrder);
