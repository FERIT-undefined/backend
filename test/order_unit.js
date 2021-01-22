const app = require("../index");
const request = require("supertest");
const User = require("../src/users/schema");
const TableOrder = require("../src/order/schema");
const { userData, adminData, defaultOrder } = require("../src/_helpers/testData")
const { expect } = require("chai");

const server = request(app);
var user, admin;

describe("Order API Test", () => {
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
    User.findOne({ email: userData.email }, (err, res) => {
      if (res == null) {
        server
          .post("/users/register")
          .send(userData)
          .expect(200)
          .expect((res) => {
            user = res.body.user;
          })
          .end(done);
      } else {
        user = res;
        done();
      }
    }).catch(done);
  });

  before((done) => {
    server
      .post("/order/add")
      .expect(201)
      .send({
        ...defaultOrder,
        accessToken: "",
        refreshToken: user.refreshToken,
      })
      .end(done);
  });

  after((done) => {
    TableOrder.deleteOne({ total_price: defaultOrder.total_price }, (res) => {
      done();
    }).catch(done);
  });

  after((done) => {
    User.findOneAndRemove({ email: userData.email }, (err, res) => {
      done();
    }).catch(done);
  });

  after((done) => {
    User.findOneAndRemove({ email: adminData.email }, (err, res) => {
      done();
    }).catch(done);
  });

  describe("GET /order", () => {
    it("should return all orders", (done) => {
      server
        .get("/order")
        .expect(200)
        .expect((res) => {
          expect(res.body.allOrders).to.be.a("array");
        })
        .end(done);
    });
  });

  describe("GET /order/:table", () => {
    it("should return all orders for given table", (done) => {
      server
        .get("/order/5")
        .expect(200)
        .expect((res) => {
          expect(res.body.tableOrders).to.be.a("array");
        })
        .end(done);
    });

    it("should return 400 bad request parameters", (done) => {
      server.get("/order/wrong").expect(400).end(done);
    });
  });

  describe("GET /order/:table/:meal", () => {
    it("should return order for given table and meal", (done) => {
      server
        .get("/order/" + defaultOrder.table + "/0")
        .expect(200)
        .expect((res) => {
          expect(res.body).to.haveOwnProperty("returnValue");
        })
        .end(done);
    });

    it("should return 400 bad request parameters", (done) => {
      server.get("/order/1/word").expect(400).end(done);
    });

    it("should return 404 no meals for given meal number", (done) => {
      server.get("/order/1/45").expect(404).end(done);
    });
  });

  describe("POST /order/add", () => {
    before((done) => {
      TableOrder.deleteOne({ total_price: defaultOrder.total_price }, (res) => {
        done();
      }).catch(done);
    });

    it("should return 201 table order saved if valid tokens", (done) => {
      server
        .post("/order/add")
        .expect(201)
        .send({
          ...defaultOrder,
          accessToken: "",
          refreshToken: user.refreshToken,
        })
        .end(done);
    });

    it("should return 400 table already has order inserted", (done) => {
      server
        .post("/order/add")
        .expect(400)
        .send({
          ...defaultOrder,
          accessToken: "",
          refreshToken: user.refreshToken,
        })
        .end(done);
    });

    it("should return 400 bad request missing parameters", (done) => {
      let newOrder = Object.assign({}, defaultOrder);
      delete newOrder.table;
      server
        .post("/order/add")
        .expect(400)
        .send({
          ...newOrder,
          accessToken: "",
          refreshToken: user.refreshToken,
        })
        .end(done);
    });
  });

  describe("PATCH /order/:id", () => {
    before((done) => {
      TableOrder.findOne(
        { total_price: defaultOrder.total_price },
        (err, res) => {
          if (res == null) {
            server
              .post("/order/add")
              .expect(201)
              .send({
                ...defaultOrder,
                accessToken: "",
                refreshToken: user.refreshToken,
              })
              .end(done);
          } else {
            done();
          }
        }
      );

      it("should return 200 order successfully edited", (done) => {
        TableOrder.findOne(
          { total_price: defaultOrder.total_price },
          (err, res) => {
            server
              .patch("/order/" + res._id)
              .expect(200)
              .send({
                table: parseInt(res.table),
                meals: res.meals,
                total_price: res.total_price,
                accessToken: "",
                refreshToken: admin.refreshToken,
              })
              .end(done);
          }
        ).catch(done);
      });

      it("should return 400 bad request with missing body parameters", (done) => {
        TableOrder.findOne(
          { total_price: defaultOrder.total_price },
          (err, res) => {
            let newOrder = Object.assign({}, res);
            delete newOrder.table;
            server
              .patch("/order/" + res._id)
              .expect(400)
              .send({
                ...newOrder,
                accessToken: "",
                refreshToken: admin.refreshToken,
              })
              .end(done);
          }
        ).catch(done);
      });

      it("should return 400 bad request with invalid ID", (done) => {
        TableOrder.findOne(
          { total_price: defaultOrder.total_price },
          (err, res) => {
            server
              .patch("/order/123")
              .expect(400)
              .send({
                ...defaultOrder,
                accessToken: "",
                refreshToken: admin.refreshToken,
              })
              .end(done);
          }
        ).catch(done);
      });

      it("should return 401 unauthorized", (done) => {
        TableOrder.findOne(
          { total_price: defaultOrder.total_price },
          (err, res) => {
            server
              .patch("/order/" + res._id)
              .expect(401)
              .send({
                table: parseInt(res.table),
                meals: res.meals,
                total_price: res.total_price,
                accessToken: "",
              })
              .end(done);
          }
        ).catch(done);
      });
    });

    describe("PATCH /order/:table/:meal", () => {
      before((done) => {
        TableOrder.findOne(
          { total_price: defaultOrder.total_price },
          (err, res) => {
            if (res == null) {
              server
                .post("/order/add")
                .expect(201)
                .send({
                  ...defaultOrder,
                  accessToken: "",
                  refreshToken: user.refreshToken,
                })
                .end(done);
            } else {
              done();
            }
          }
        );

        it("should return 200 order successfully edited", (done) => {
          server
            .patch("/order/" + defaultOrder.table + "/0")
            .expect(200)
            .send({
              status: "done",
              accessToken: "",
              refreshToken: admin.refreshToken,
            })
            .end(done);
        });

        it("should return 400 status is required", (done) => {
          server
            .patch("/order/" + defaultOrder.table + "/0")
            .expect(400)
            .send({
              accessToken: "",
              refreshToken: admin.refreshToken,
            })
            .end(done);
        });

        it("should return 400 wrong url parameters number required", (done) => {
          server
            .patch("/order/" + defaultOrder.table + "/word")
            .expect(400)
            .send({
              accessToken: "",
              refreshToken: admin.refreshToken,
            })
            .end(done);
        });

        it("should return 400 invalid status", (done) => {
          server
            .patch("/order/" + defaultOrder.table + "/0")
            .expect(400)
            .send({
              status: "test",
              accessToken: "",
              refreshToken: admin.refreshToken,
            })
            .end(done);
        });

        it("should return 400 invalid meal ID", (done) => {
          server
            .patch("/order/1/33")
            .expect(400)
            .send({
              status: "done",
              accessToken: "",
              refreshToken: admin.refreshToken,
            })
            .end(done);
        });

        it("should return 404 order not found in a database", (done) => {
          server
            .patch("/order/15/33")
            .expect(404)
            .send({
              status: "done",
              accessToken: "",
              refreshToken: admin.refreshToken,
            })
            .end(done);
        });
      });
    });
  });
});
