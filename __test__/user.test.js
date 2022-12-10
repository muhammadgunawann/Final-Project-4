const request = require("supertest");
const app = require("../index");
const { sequelize } = require("../models");
const { generateToken } = require("../helper/jwt");

const userDataUpdate = {
  id: 55,
  full_name: "ahmad",
  email: "ahmad@gmail.com",
  username: "ahmad",
  password: "12345678",
  profile_image_url: "https://facebook.com/ahmad",
  age: 22,
  phone_number: 6282283351419,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const userDataDelete = {
  id: 66,
  full_name: "annisa",
  email: "annisa@gmail.com",
  username: "annisa",
  password: "12345678",
  profile_image_url: "https://facebook.com/annisa",
  age: 22,
  phone_number: 6282283351419,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const userData = {
  full_name: "jhonny",
  email: "jhonny@gmail.com",
  username: "jhonny",
  password: "12345678",
  profile_image_url: "https://facebook.com/jhonny",
  age: 22,
  phone_number: 6282283351419,
};

let authorizationUpdate = "";
let authorizationDelete = "";

beforeAll((done) => {
  sequelize.queryInterface
    .bulkInsert("Users", [userDataUpdate], {})
    .then(() => {
      authorizationUpdate = generateToken({
        id: userDataUpdate.id,
        username: userDataUpdate.username,
        email: userDataUpdate.email,
      });
      done();
    })
    .catch((err) => {
      done(err);
    });

  sequelize.queryInterface
    .bulkInsert("Users", [userDataDelete], {})
    .then(() => {
      authorizationDelete = generateToken({
        id: userDataDelete.id,
        username: userDataDelete.username,
        email: userDataDelete.email,
      });
      done();
    })
    .catch((err) => {
      done(err);
    });
});

describe("POST /users/register", () => {
  it("should send response wth 201 status code", (done) => {
    request(app)
      .post("/users/register")
      .send(userData)
      .end(function (err, res) {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(201);
        expect(typeof res.body).toEqual("object");
        expect(res.body.user).toHaveProperty("email");
        expect(res.body.user.username).toEqual(userData.username);
        expect(res.body.user.email).toEqual(userData.email);

        done();
      });
  });
});

const userDataError = {
  full_name: "",
  email: "jhonny@",
  username: "jhonny",
  password: "12345678",
  profile_image_url: "https://facebook.com/jhonny",
  age: 22,
  phone_number: 6282283351419,
};
describe("POST /users/register ERROR", () => {
  it("should send response wth 404 status code", (done) => {
    request(app)
      .post("/users/register")
      .send(userDataError)
      .end(function (err, res) {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(404);
        expect(res.body).toEqual({
          message: "Column full name cannot be empty",
        });

        done();
      });
  });
});

const userLogin = {
  email: "jhonny@gmail.com",
  password: "12345678",
};

describe("POST /users/login", () => {
  it("should send response wth 200 status code", (done) => {
    request(app)
      .post("/users/login")
      .send(userLogin)
      .end(function (err, res) {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(200);
        expect(res.type).toBe("application/json");
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("token");
        expect(typeof res.body.token).toEqual("string");

        done();
      });
  });
});

const wrongUser = {
  email: "jhonny@gmail.com",
  password: "123456",
};

describe("POST /users/login ERROR", () => {
  it("should send response wth 400 status code", (done) => {
    request(app)
      .post("/users/login")
      .send(wrongUser)
      .end(function (err, res) {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(400);
        expect(res.body).toEqual({ message: "Wrong Password" });

        done();
      });
  });
});

const updateDataUserError = {
  full_name: "ridho",
  email: "",
  username: "ridho",
  profile_image_url: "https://facebook.com/ridho",
  age: 23,
  phone_number: 6282283351419,
};

describe("PUT /users/:userId ERROR", () => {
  it("should send response wth 404 status code", (done) => {
    request(app)
      .put(`/users/${userDataUpdate.id}`)
      .set("authorization", authorizationUpdate)
      .send(updateDataUserError)
      .end(function (err, res) {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(404);
        expect(res.body).toEqual({ message: "Column email cannot be empty" });

        done();
      });
  });
});

const updateDataUser = {
  full_name: "ridho",
  email: "ridho@gmail.com",
  username: "ridho",
  profile_image_url: "https://facebook.com/ridho",
  age: 23,
  phone_number: 6282283351419,
};

describe("PUT /users/:userId ", () => {
  it("should send response wth 200 status code", (done) => {
    request(app)
      .put(`/users/${userDataUpdate.id}`)
      .set("authorization", authorizationUpdate)
      .send(updateDataUser)
      .end(function (err, res) {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(200);
        expect(typeof res.body).toEqual("object");
        expect(res.body.user).toHaveProperty("email");
        expect(res.body.user.email).toBe(updateDataUser.email);
        expect(res.type).toBe("application/json");

        done();
      });
  });
});

describe("DELETE users/:userId", () => {
  it("should send response wth 200 status code", (done) => {
    request(app)
      .delete(`/users/${userDataDelete.id}`)
      .set("authorization", authorizationDelete)
      .end(function (err, res) {
        if (err) {
          done(err);
        }

        expect(res.status).toBe(200);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toEqual({
          message: "Your account has been successfully deleted",
        });
        expect(res.type).toBe("application/json");
        expect(res.statusType).toBe(2);

        done();
      });
  });
});

describe("DELETE /users/:userId ERROR", () => {
  it("should send response wth 401 status code", (done) => {
    request(app)
      .delete(`/users/3`)
      .set("authorization", authorizationDelete)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(401);
        expect(res.body).toEqual({ message: "invalid user id" });

        done();
      });
  });
});

afterAll((done) => {
  sequelize.queryInterface
    .bulkDelete("Users", {})
    .then(() => {
      return done();
    })
    .catch((err) => {
      done(err);
    });
});
