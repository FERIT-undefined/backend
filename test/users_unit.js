const app = require("../index");
const request = require("supertest");
const User = require("../src/users/schema");
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

const server = request(app);
var user, admin;
const newRole = "SuperAdmin";
const newEmail = "wrongmail.com";
const newFname = "Admin";

describe("Users API Test", () => {
  describe("POST /users/register", () => {
    before((done) => {
      User.findOneAndRemove({ email: userData.email }, (err) => {
        done();
      }).catch((err) => done(err));
    });

    it("should create user and return user with tokens", (done) => {
      server
        .post("/users/register")
        .send(userData)
        .expect(200)
        .expect((res) => {
          let response = res.body.user;
          expect(response).to.have.property("id");
          expect(response).to.have.property("fname");
          expect(response).to.have.property("lname");
          expect(response).to.have.property("role");
          expect(response).to.have.property("accessToken");
          expect(response).to.have.property("refreshToken");
        })
        .end(done);
    });

    it("should return email already in use", (done) => {
      server.post("/users/register").send(userData).expect(400).end(done);
    });

    it("should return incomplete register data", (done) => {
      server
        .post("/users/register")
        .send({
          fname: userData.fname,
        })
        .expect(422)
        .end(done);
    });
  });

  describe("POST /users/login", () => {
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

    it("should login user and return user with tokens", (done) => {
      server
        .post("/users/login")
        .send({ email: user.email, password: user.password })
        .expect(200)
        .expect((res) => {
          let response = res.body.user;
          expect(response).to.have.property("id");
          expect(response).to.have.property("fname");
          expect(response).to.have.property("lname");
          expect(response).to.have.property("role");
          expect(response).to.have.property("accessToken");
          expect(response).to.have.property("refreshToken");
        })
        .end(done);
    });

    it("should reject invalid login credentials", (done) => {
      server
        .post("/users/login")
        .send({ email: user.fname + user.email, password: user.password })
        .expect(401)
        .end(done);
    });

    it("should reject incomplete login credentials", (done) => {
      server
        .post("/users/login")
        .send({ password: user.password })
        .expect(422)
        .end(done);
    });
  });

  describe("POST /users/logout", () => {
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
      }).catch((err) => done(err));
    });

    it("should logout user", (done) => {
      server
        .post("/users/logout")
        .send({ refreshToken: user.refreshToken })
        .expect(200)
        .end(done);
    });

    it("should delete refreshToken from user", (done) => {
      User.findOne({ email: userData.email }, (err, res) => {
        expect(res.refreshToken).is.empty;
        done();
      }).catch((err) => done(err));
    });

    it("should return 400 bad request no refresh token", (done) => {
      server
        .post("/users/logout")
        .send({ refreshToken: "" })
        .expect(200)
        .end(done);
    });
  });

  describe("POST /users", () => {
    it("should return 401 role not authorized", (done) => {
      server
        .post("/users")
        .send({ refreshToken: "" })
        .expect(401)
        .end(done);
    });

    describe("Default role", () => {
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
        }).catch((err) => done(err));
      });

      it("should return forbidden access 403", (done) => {
        server
          .post("/users")
          .send({ accessToken: "", refreshToken: user.refreshToken })
          .expect(403)
          .end(done);
      });
    });

    describe("Admin role", () => {
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
        }).catch((err) => done(err));
      });

      it("should return list of users", (done) => {
        server
          .post("/users")
          .send({ accessToken: "", refreshToken: admin.refreshToken })
          .expect(200)
          .expect((res) => {
            expect(res.body.data).to.be.a("array");
          })
          .end(done);
      });
    });
  });

  describe("DELETE /users/remove/:id", () => {
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
      }).catch((err) => done(err));
    });

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
      }).catch((err) => done(err));
    });

    it("should remove user when logged with admin role", (done) => {
      User.find({ email: userData.email })
        .then((res) => {
          server
            .delete("/users/remove/" + res[0]._id)
            .send({ accessToken: "", refreshToken: admin.refreshToken })
            .expect(200)
            .end(done);
        })
        .catch((err) => done(err));
    });

    it("should return 400 wrong id length", (done) => {
      server
        .delete("/users/remove/" + adminData.fname)
        .send({ accessToken: "", refreshToken: admin.refreshToken })
        .expect(400)
        .end(done);
    });

    it("should return 401 role not authorized", (done) => {
      server
        .delete("/users/remove/" + user.id)
        .send({ accessToken: "", refreshToken: "" })
        .expect(401)
        .end(done);
    });

    it("should return 403 forbidden access", (done) => {
      server
        .delete("/users/remove/" + user.id)
        .send({ accessToken: "", refreshToken: user.refreshToken })
        .expect(403)
        .end(done);
    });

    it("should return 409 conflict when try to delete own account", (done) => {
      User.find({ email: adminData.email })
        .then((res) => {
          server
            .delete("/users/remove/" + res[0]._id)
            .send({ accessToken: "", refreshToken: admin.refreshToken })
            .expect(409)
            .end(done);
        })
        .catch((err) => done(err));
    });

    it("should return 500 user when given id doesnt exist", (done) => {
      server
        .delete("/users/remove/" + user.id)
        .send({ accessToken: "", refreshToken: admin.refreshToken })
        .expect(500)
        .end(done);
    });
  });

  describe("PATCH /users/:id", () => {
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
      }).catch((err) => done(err));
    });

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
      }).catch((err) => done(err));
    });

    it("should update user when logged with admin role", (done) => {
      User.find({ email: adminData.email })
        .then((res) => {
          server
            .patch("/users/" + res[0]._id)
            .send({
              fname: newFname,
              accessToken: "",
              refreshToken: admin.refreshToken,
            })
            .expect(200)
            .expect((res) => {
              expect(res.body.user.fname).equals(newFname);
            })
            .end(done);
        })
        .catch((err) => done(err));
    });

    it("should update user when logged with own account", (done) => {
      User.find({ email: userData.email })
        .then((res) => {
          server
            .patch("/users/" + res[0]._id)
            .send({
              fname: newFname,
              accessToken: "",
              refreshToken: user.refreshToken,
            })
            .expect(200)
            .expect((res) => {
              expect(res.body.user.fname).equals(newFname);
            })
            .end(done);
        })
        .catch((err) => done(err));
    });

    it("should return 400 invalid role", (done) => {
      User.find({ email: userData.email })
        .then((res) => {
          server
            .patch("/users/" + res[0]._id)
            .send({
              role: "test",
              accessToken: "",
              refreshToken: admin.refreshToken,
            })
            .expect(400)
            .end(done);
        })
        .catch((err) => done(err));
    });

    it("should return 400 invalid ID", (done) => {
      server
        .patch("/users/" + admin.fname)
        .send({
          fname: newFname,
          accessToken: "",
          refreshToken: admin.refreshToken,
        })
        .expect(400)
        .end(done);
    });

    it("should return 400 invalid updates", (done) => {
      User.find({ email: adminData.email })
        .then((res) => {
          server
            .patch("/users/" + res[0]._id)
            .send({
              role: newRole,
              accessToken: "",
              refreshToken: admin.refreshToken,
            })
            .expect(400)
            .end(done);
        })
        .catch((err) => done(err));
    });

    it("should return 400 wrong email format", (done) => {
      User.find({ email: adminData.email })
        .then((res) => {
          server
            .patch("/users/" + res[0]._id)
            .send({
              email: newEmail,
              accessToken: "",
              refreshToken: admin.refreshToken,
            })
            .expect(400)
            .end(done);
        })
        .catch((err) => done(err));
    });

    it("should return 401 role not authorized", (done) => {
      User.find({ email: adminData.email })
        .then((res) => {
          server
            .patch("/users/" + res[0]._id)
            .send({
              fname: newFname,
              accessToken: "",
              refreshToken: user.refreshToken,
            })
            .expect(401)
            .end(done);
        })
        .catch((err) => done(err));
    });
  });
});
