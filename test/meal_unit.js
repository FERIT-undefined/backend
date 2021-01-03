const app = require("../index");
const request = require("supertest");
const User = require("../src/users/schema");
const Menu = require("../src/menu/schema");
const mealType = require("../src/_helpers/meals");
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

var user, admin, menu;

const server = request(app);

describe("Menu API Test", () => {
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

  describe("GET /menu", () => {

    it("should return all meals on menu", (done) => {
      server
        .get("/menu")
        .expect(200)
        .expect((res) => {
          expect(res.body.allMeals).to.be.a("array");
        })
        .end(done);
    });

    it("should return 404 no meals in database", (done) => {
      Menu.deleteMany({}, (res) => {
        server.get("/menu").expect(404).end(done);
      }).catch(done);
    });
  });

  describe("POST /menu/add", () => {
    before((done) => {
      Menu.deleteMany({}, (res) => {
        done();
      });
    });

    it("should return 201 meal successfully saved", (done) => {
      server
        .post("/menu/add")
        .send({
          ...defaultMenu,
          accessToken: "",
          refreshToken: admin.refreshToken,
        })
        .expect(201)
        .end(done);
    });

    it("should return 400 meal already exists on the menu", (done) => {
      server
        .post("/menu/add")
        .send({
          ...defaultMenu,
          accessToken: admin.accessToken,
          refreshToken: admin.refreshToken,
        })
        .expect(400)
        .end(done);
    });

    it("should return 403 forbidden for user role", (done) => {
      server
        .post("/menu/add")
        .send({
          ...defaultMenu,
          accessToken: "",
          refreshToken: user.refreshToken,
        })
        .expect(403)
        .end(done);
    });
  });

  describe("DELETE /menu/remove/:id", () => {
    before((done) => {
      menu = new Menu(defaultMenu);
      menu.save(done);
    });

    after((done) => {
      Menu.deleteMany({}, (res) => {
        done();
      });
    });

    it("should return 400 invalid ID length", (done) => {
      server
        .delete("/menu/remove/123")
        .send({
          accessToken: "",
          refreshToken: user.refreshToken,
        })
        .expect(400)
        .end(done);
    });

    it("should return 403 forbidden for user role", (done) => {
      server
        .delete("/menu/remove/" + menu.id)
        .send({
          accessToken: "",
          refreshToken: user.refreshToken,
        })
        .expect(403)
        .end(done);
    });

    it("should return 201 meal successfully removed", (done) => {
      server
        .delete("/menu/remove/" + menu.id)
        .send({
          accessToken: "",
          refreshToken: admin.refreshToken,
        })
        .expect(201)
        .end(done);
    });
  });

  describe("PATCH /menu/:id", () => {
    before((done) => {
      menu = new Menu(defaultMenu);
      menu.save(done);
    });

    it("should return 200 meal successfully edited", (done) => {
      server
        .patch("/menu/" + menu.id)
        .send({
          ...defaultMenu,
          accessToken: "",
          refreshToken: admin.refreshToken,
        })
        .expect(200)
        .end(done);
    });

    it("should return 400 invalid ID length", (done) => {
      server
        .patch("/menu/123")
        .send({
          accessToken: "",
          refreshToken: admin.refreshToken,
        })
        .expect(400)
        .end(done);
    });

    it("should return 403 forbidden for user role", (done) => {
      server
        .patch("/menu/" + menu.id)
        .send({
          ...defaultMenu,
          accessToken: "",
          refreshToken: user.refreshToken,
        })
        .expect(403)
        .end(done);
    });

    it("should return 400 bad request wrong body parameters", (done) => {
      server
        .patch("/menu/" + menu.id)
        .send({
          ...defaultMenu,
          accessToken: "",
          refreshToken: admin.refreshToken,
          fail: true,
        })
        .expect(400)
        .end(done);
    });
  });
});
