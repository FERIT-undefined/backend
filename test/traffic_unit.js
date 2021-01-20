const app = require("../index");
const request = require("supertest");
const { expect } = require("chai");
const meals = require("../src/_helpers/meals");
const OrderTraffic = require("../src/traffic/schema");
const Order = require("../src/order/schema");
const User = require("../src/users/schema");

const defaultTraffic = {
  startDate: "2000-12-22T11:00:00",
  endDate: "2150-12-22T11:00:00",
  oldStartDate: "2000-12-22T11:00:00",
  oldEndDate: "2000-12-22T11:00:00",
};

const defaultOrder = {
  table: 999,
  meals: [
    {
      name: "test",
      price: 23,
      quantity: 3,
      status: "Started",
      type: meals.Desert,
    },
  ],
  total_price: 999999,
};

const userData = {
  email: "test@test.com",
  password: "test123",
  role: "Konobar",
  fname: "Test",
  lname: "Test",
};

var user, order;
const server = request(app);

describe("Traffic API Test", () => {
  before((done) => {
    User.findOne({ email: userData.email })
      .then((err, res) => {
        if (res == null) {
          user = new User(userData);
          user.save();
        }
        if (user == null) user = res;
        done();
      })
      .catch((err) => done(err));
  });
  before((done) => {
    Order.findOne({ total_price: defaultOrder.total_price })
      .then((err, res) => {
        if (res == null) {
          order = new Order(defaultOrder);
          order.save();
        }
        if (order == null) order = res;
        done();
      })
      .catch((err) => done(err));
  });

  describe("GET /order/:start/:end", () => {
    before((done) => {
      server
        .patch("/order/export")
        .send({ table: defaultOrder.table })
        .expect(200)
        .end(done);
    });

    after((done) => {
      OrderTraffic.deleteOne({ billId: order.id }, (err, res) => {
        done();
      }).catch(done);
    });

    it("return all finished orders in the given datetime range", (done) => {
      server
        .get(
          "/traffic/" + defaultTraffic.startDate + "/" + defaultTraffic.endDate
        )
        .expect(200)
        .expect((res) => {
          expect(res.body.traffic).to.be.a("array");
        })
        .end(done);
    });

    it("return 404 when no orders between given datetimes", (done) => {
      server
        .get(
          "/traffic/" +
            defaultTraffic.oldStartDate +
            "/" +
            defaultTraffic.oldEndDate
        )
        .expect(404)
        .end(done);
    });
  });
});
