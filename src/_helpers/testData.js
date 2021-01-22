const mealType = require("./meals");

exports.userData = {
  email: "test@test.com",
  password: "test123",
  role: "Konobar",
  fname: "Test",
  lname: "Test",
};

exports.adminData = {
  email: "admin@test.com",
  password: "admin123",
  role: "Admin",
  fname: "Test",
  lname: "Test",
};

exports.defaultMenu = {
  name: "Test jelo",
  description: "Najfinije palacinke u gradu sa voćnim prelijevom",
  price: 23,
  type: mealType.Desert,
  pdv: 15,
  discount: 5,
};

exports.defaultOrder = {
  table: 5,
  meals: [
    {
      name: "Test",
      price: 23,
      quantity: 3,
      status: "Started",
      type: mealType.Desert,
    },
  ],
  total_price: 99999,
};

exports.defaultTrafficDates = {
  startDate: "2000-12-22T11:00:00",
  endDate: "2025-12-22T11:00:00",
  oldStartDate: "2000-12-22T11:00:00",
  oldEndDate: "2000-12-22T11:00:00",
};

exports.defaultOrderTraffic = {
  billId: "um5TYe6dtkuYNMK4wmH211",
  meals: [
    {
      name: "Test",
      price: 23,
      quantity: 3,
      status: "Started",
      type: mealType.Desert,
    },
  ],
  finished_timestamp: Date.now(),
};