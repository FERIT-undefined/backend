const mongoose = require("mongoose");
const mealType = require("../_helpers/meals.js");

const Schema = mongoose.Schema;

const menuMeal = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    price: {
      type: Number,
      required: true
    },
    type: {
      type: mealType,
      required: true
    },
    pdv: {
      type: Number,
      required: true,
      default: 0
    },
    discount: {
      type: Number,
      required: true,
      default: 0
    },
  },
  { collection: "menuMeals" }
);

module.exports = mongoose.model("menuMeal", menuMeal);
