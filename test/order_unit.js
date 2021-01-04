const app = require("../index");
const request = require("supertest");
const User = require("../src/users/schema");
const Menu = require("../src/menu/schema");
const mealType = require("../src/_helpers/meals");
const TableOrder = require("../src/order/schema");
const { expect } = require("chai");

const userData = {
  email: "test@test.com",
  password: "test123",
  role: "Konobar",
  fname: "Test",
  lname: "Test",
};

const adminData = {
  email: "admin@test.com",
  password: "admin123",
  role: "Admin",
  fname: "Test",
  lname: "Test",
};

const defaultMenu = {
  name: "Palačinke",
  description: "Najfinije palacinke u gradu sa voćnim prelijevom",
  price: 23,
  type: mealType.Desert,
  pdv: 15,
  discount: 5,
};

const defaultOrder = {
  table: 1,
  meals: [
    {
      name: "Palačinke",
      price: 23,
      quantity: 3,
      status: "Started",
      type: mealType.Desert,
    },
  ],
  total_price: 96,
};

var user, admin;

const server = request(app);

describe("Order API Test", () => {
  before((done) => {
    User.findOneAndRemove({ email: adminData.email }, (err) => {
      server
        .post("/users/register")
        .send(adminData)
        .expect(200)
        .expect((res) => {
          admin = res.body.user;
        })
        .end(done);
    }).catch(done);
  });

  before((done) => {
    User.findOneAndRemove({ email: userData.email }, (err) => {
      server
        .post("/users/register")
        .send(userData)
        .expect(200)
        .expect((res) => {
          user = res.body.user;
        })
        .end(done);
    }).catch(done);
  });

  describe("GET /order", () => {
    before((done) => {
      TableOrder.deleteMany({}, (res) => {
        server
          .post("/order/add")
          .expect(201)
          .send({
            ...defaultOrder,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
          })
          .end(done);
      }).catch(done);
    });

    it("should return all orders", (done) => {
      server
        .get("/order")
        .expect(200)
        .expect((res) => {
          expect(res.body.allOrders).to.be.a("array");
        })
        .end(done);
    });

    it("should return 404 no orders in database", (done) => {
      TableOrder.deleteMany({}, (res) => {
        server.get("/order").expect(404).end(done);
      }).catch(done);
    });
  });

  describe("GET /order/:table", () => {
    before((done) => {
      server
        .post("/order/add")
        .expect(201)
        .send({
          ...defaultOrder,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        })
        .end(done);
    });

    it("should return all orders for given table", (done) => {
      server
        .get("/order/1")
        .expect(200)
        .expect((res) => {
          expect(res.body.tableOrders).to.be.a("array");
        })
        .end(done);
    });

    it("should return 400 bad request parameters", (done) => {
      server.get("/order/a").expect(400).end(done);
    });

    it("should return 404 no orders in database for given table", (done) => {
      TableOrder.deleteMany({}, (res) => {
        server.get("/order/1").expect(404).end(done);
      }).catch(done);
    });
  });

  describe("GET /order/:table/:meal", () => {
    before((done) => {
      server
        .post("/order/add")
        .expect(201)
        .send({
          ...defaultOrder,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        })
        .end(done);
    });

    it("should return order for given table and meal", (done) => {
      server
        .get("/order/1/0")
        .expect(200)
        .expect((res) => {
          expect(res.body).to.haveOwnProperty("returnValue");
        })
        .end(done);
    });

    it("should return 400 bad request parameters", (done) => {
      server.get("/order/1/word").expect(400).end(done);
    });

    it("should return 404 no orders in database for given table", (done) => {
      TableOrder.deleteMany({}, (res) => {
        server.get("/order/1/2").expect(404).end(done);
      }).catch(done);
    });

    it("should return 404 no meals for given meal number", (done) => {
      server.get("/order/1/15").expect(404).end(done);
    });
  });

  describe("POST /order/add", () => {
    before((done) => {
      TableOrder.deleteMany({}, (res) => {
        done();
      }).catch(done);
    });

    it("should return 201 table order saved if valid tokens", (done) => {
      server
        .post("/order/add")
        .expect(201)
        .send({
          ...defaultOrder,
          accessToken: user.accessToken,
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
          accessToken: user.accessToken,
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
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        })
        .end(done);
    });

    it("should return 401 unauthorized", (done) => {
      server
        .post("/order/add")
        .expect(401)
        .send({
          ...defaultOrder,
          accessToken: user.accessToken,
        })
        .end(done);
    });
  });

  describe("PATCH /order/:id", () => {
    before((done) => {
      TableOrder.deleteMany({}, (res) => {
        server
          .post("/order/add")
          .expect(201)
          .send({
            ...defaultOrder,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
          })
          .end(done);
      }).catch(done);
    });

    it("should return 200 order successfully edited", (done) => {
      TableOrder.findOne({ table: defaultOrder.table }, (err, res) => {
        res.total_price = 99;
        server
          .patch("/order/" + res._id)
          .expect(200)
          .send({
            table: parseInt(res.table),
            meals: res.meals,
            total_price: 99,
            accessToken: admin.accessToken,
            refreshToken: admin.refreshToken,
          })
          .end(done);
      }).catch(done);
    });

    it("should return 400 bad request with missing body parameters", (done) => {
      TableOrder.findOne({ table: defaultOrder.table }, (err, res) => {
        let newOrder = Object.assign({}, res);
        delete newOrder.table;
        server
          .patch("/order/" + res._id)
          .expect(400)
          .send({
            ...newOrder,
            accessToken: admin.accessToken,
            refreshToken: admin.refreshToken,
          })
          .end(done);
      }).catch(done);
    });

    it("should return 400 bad request with invalid ID", (done) => {
      TableOrder.findOne({ table: defaultOrder.table }, (err, res) => {
        server
          .patch("/order/123")
          .expect(400)
          .send({
            ...defaultOrder,
            accessToken: admin.accessToken,
            refreshToken: admin.refreshToken,
          })
          .end(done);
      }).catch(done);
    });

    it("should return 401 unauthorized", (done) => {
      TableOrder.findOne({ table: defaultOrder.table }, (err, res) => {
        res.total_price = 99;
        server
          .patch("/order/" + res._id)
          .expect(401)
          .send({
            table: parseInt(res.table),
            meals: res.meals,
            total_price: 99,
            accessToken: admin.accessToken,
          })
          .end(done);
      }).catch(done);
    });
  });

  describe("PATCH /order/:table/:meal", () => {
    beforeEach((done) => {
      TableOrder.deleteMany({}, (res) => {
        server
          .post("/order/add")
          .expect(201)
          .send({
            ...defaultOrder,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
          })
          .end(done);
      }).catch(done);
    });

    it("should return 200 order successfully edited", (done) => {
      server
        .patch("/order/1/0")
        .expect(200)
        .send({
          status: "done",
          accessToken: admin.accessToken,
          refreshToken: admin.refreshToken,
        })
        .end(done);
    });

    it("should return 400 status is required", (done) => {
      server
        .patch("/order/1/0")
        .expect(400)
        .send({
          accessToken: admin.accessToken,
          refreshToken: admin.refreshToken,
        })
        .end(done);
    });

    it("should return 400 wrong url parameters number required", (done) => {
      server
        .patch("/order/1/word")
        .expect(400)
        .send({
          accessToken: admin.accessToken,
          refreshToken: admin.refreshToken,
        })
        .end(done);
    });

    it("should return 400 invalid status", (done) => {
      server
        .patch("/order/1/0")
        .expect(400)
        .send({
          status: "test",
          accessToken: admin.accessToken,
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
          accessToken: admin.accessToken,
          refreshToken: admin.refreshToken,
        })
        .end(done);
    });

    it("should return 404 order not found in a database", (done) => {
      server
        .patch("/order/15/33")
        .expect(400)
        .send({
          status: "done",
          accessToken: admin.accessToken,
          refreshToken: admin.refreshToken,
        })
        .end(done);
    });
  });
});
