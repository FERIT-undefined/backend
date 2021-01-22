const app = require("../index");
const request = require("supertest");
const { expect } = require("chai");
const OrderTraffic = require("../src/traffic/schema");
const User = require("../src/users/schema");
const {
  defaultTrafficDates,
  adminData,
  defaultOrderTraffic,
} = require("../src/_helpers/testData");

const server = request(app);
var admin, orderTraffic;

describe("Traffic API Test", () => {
  before((done) => {
    User.findOne({ email: adminData.email }, (err, res) => {
      if (res == null) {
        server
          .post("/users/register")
          .send(adminData)
          .expect(200)
          .expect((res) => {
            admin = res.body.user;
          })
          .end(done);
      } else {
        admin = res;
        done();
      }
    }).catch(done);
  });

  before((done) => {
    orderTraffic = new OrderTraffic(defaultOrderTraffic);
    orderTraffic.save(done);
  });

  after((done) => {
    User.findOneAndRemove({ email: adminData.email }, (err, res) => {
      done();
    }).catch(done);
  });

  after((done) => {
    OrderTraffic.findOneAndRemove(
      { billId: orderTraffic.billId },
      (err, res) => {
        done();
      }
    ).catch(done);
  });

  describe("GET /order/:start/:end", () => {
    it("return all finished orders in the given datetime range", (done) => {
      server
        .get(
          "/traffic/" +
            defaultTrafficDates.startDate +
            "/" +
            defaultTrafficDates.endDate
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
            defaultTrafficDates.oldStartDate +
            "/" +
            defaultTrafficDates.oldEndDate
        )
        .expect(404)
        .end(done);
    });
  });
});
