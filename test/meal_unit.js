const app = require("../index");
const request = require("supertest");
const User = require("../src/users/schema");
const Menu = require("../src/menu/schema");
const { userData, adminData, defaultMenu } = require("../src/_helpers/testData")
const { expect } = require("chai");

var user, admin, menu;

const server = request(app);

describe("Menu API Test", () => {
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

  after((done) => {
    Menu.findOneAndRemove({ name: defaultMenu.name }, (err, res) => {
        done();
      }).catch(done);
  });
  describe("POST /menu/add", () => {
    before((done) => {
      Menu.deleteOne({ name: defaultMenu.name }, (res) => {
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
          accessToken: "",
          refreshToken: admin.refreshToken,
        })
        .expect(400)
        .end(done);
    });

    it("should return 401 unauthorized", (done) => {
      server
        .post("/menu/add")
        .send({
          ...defaultMenu,
          accessToken: "",
          refreshToken: "",
        })
        .expect(401)
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


  describe("GET /menu", () => {
    before((done) => {
      Menu.findOne({ name: defaultMenu.name }, (err, res) => {
        if(res == null){
          server
            .post("/menu/add")
            .send({
              ...defaultMenu,
              accessToken: "",
              refreshToken: admin.refreshToken,
            })
            .expect(201)
            .end(done);
        } else{
          done();
        }
      });
    });
    
    it("should return all meals on menu", (done) => {
      server
        .get("/menu")
        .expect(200)
        .expect((res) => {
          expect(res.body.allMeals).to.be.a("array");
        })
        .end(done);
    });
  });

  describe("PATCH /menu/:id", () => {
    before((done) => {
      Menu.findOne({ name: defaultMenu.name }, (err, res) => {
        if(res == null){
          server
            .post("/menu/add")
            .send({
              ...defaultMenu,
              accessToken: "",
              refreshToken: admin.refreshToken,
            })
            .expect(201)
            .end(done);
        } else{
          done();
        }
      });
    });

    beforeEach((done) => {
      Menu.findOne({ name: defaultMenu.name }, (err, res) => {
        menu = res;
        done();
      });
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
  });

  describe("DELETE /menu/remove/:id", () => {
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

    it("should return 401 unauthorized", (done) => {
      server
        .delete("/menu/remove/123")
        .send({
          accessToken: "",
          refreshToken: "",
        })
        .expect(401)
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
  });
});
