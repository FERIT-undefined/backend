const app = require("../index");
const request = require("supertest");
const { expect } = require("chai");
const meals = require("../src/_helpers/meals");
const OrderTraffic = require("../src/traffic/schema");

const defaultTrafic = {
  start: "2020-12-22T11:00:00",
  end: "2020-12-30T12:00:00",
};

var user, admin, menu;

const server = request(app);

describe("Traffic API Test", () => {
  before((done) => {
    const trafficOrder = new OrderTraffic();
    trafficOrder.name = "Čevapi";
    trafficOrder.price = 30;
    trafficOrder.type = meals.Grill;
    trafficOrder.finished_timestamp = new Date("2020-12-25T11:00:00").getTime();
    trafficOrder.save(done);
  });

  before((done) => {
    const trafficOrder = new OrderTraffic();
    trafficOrder.name = "Palačinke";
    trafficOrder.price = 18;
    trafficOrder.type = meals.Desert;
    trafficOrder.finished_timestamp = new Date("2020-12-28T11:00:00").getTime();
    trafficOrder.save(done);
  });

  describe("GET /order/:start/:end", () => {
    it("return all finished orders in the given datetime range", (done) => {
      server
        .get("/traffic/" + defaultTrafic.start + "/" + defaultTrafic.end)
        .expect(200)
        .expect((res) => {
          expect(res.body.traffic).to.be.a("array");
        })
        .end(done);
    });
  });

  describe("GET /order/:start/:end", () => {
    it("return 404 when no orders between given datetimes", (done) => {
      OrderTraffic.deleteMany({}, (res) => {
        server
          .get("/traffic/" + defaultTrafic.start + "/" + defaultTrafic.end)
          .expect(404)
          .end(done);
      });
    });
  });
});
