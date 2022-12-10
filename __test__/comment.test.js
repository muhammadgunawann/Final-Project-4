const app = require("../index");
const { generateToken } = require("../helper/jwt");
const request = require("supertest");
const { sequelize } = require("../models");

const userDataInComment = {
  id: 39,
  full_name: "Andi",
  email: "andi@gmail.com",
  username: "andi",
  password: "123456789",
  profile_image_url: "https://facebook.com/andi/profile",
  age: 22,
  phone_number: 628221351567,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const photoDataInComment = {
  id: 3,
  titel: "Photo example",
  caption: "photo example",
  poster_image_url: "https://facebook.com/budianto/example",
  UserId: userDataInComment.id,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const commentDataUpdate = {
  id: 11,
  comment: "Hello update",
  PhotoId: photoDataInComment.id,
  UserId: userDataInComment.id,
  createdAt: new Date(),
  updatedAt: new Date(),
};

let authorization = "";

beforeAll((done) => {
  sequelize.queryInterface
    .bulkInsert("Users", [userDataInComment], {})
    .then(() => {
      authorization = generateToken({
        id: userDataInComment.id,
        username: userDataInComment.username,
        email: userDataInComment.email,
      });
      done();
    })
    .catch((err) => {
      done(err);
    });

  sequelize.queryInterface
    .bulkInsert("Photos", [photoDataInComment], {})
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });

  sequelize.queryInterface
    .bulkInsert("Comments", [commentDataUpdate], {})
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

const commentCreate = {
  id: 4,
  comment: "Hello example",
  PhotoId: photoDataInComment.id,
  UserId: userDataInComment.id,
};

describe("POST /comments ", () => {
  it("should send response with 201 status code", (done) => {
    request(app)
      .post("/comments")
      .set("authorization", authorization)
      .send(commentCreate)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.status).toBe(201);
        expect(typeof res.body.comment).toEqual("object");
        expect(res.body.comment).toHaveProperty("comment");
        expect(res.body.comment).toHaveProperty("id");
        expect(res.type).toEqual("application/json");

        done();
      });
  });
});

const commentCreateError = {
  id: 4,
  comment: " ",
  PhotoId: photoDataInComment.id,
  UserId: userDataInComment.id,
};

describe("POST /comments ERROR", () => {
  it("should send response with 404 status code", (done) => {
    request(app)
      .post("/comments")
      .set("authorization", authorization)
      .send(commentCreateError)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Column comment cannot be empty" });

        done();
      });
  });
});

describe("GET /comments ", () => {
  it("should send response with 200 status code", (done) => {
    request(app)
      .get("/comments")
      .set("authorization", authorization)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.status).toBe(200);
        expect(typeof res.body).toEqual("object");
        expect(res.body[0]).toHaveProperty("comment");
        expect(res.body[0]).toHaveProperty("id");
        expect(res.type).toEqual("application/json");

        done();
      });
  });
});

describe("GET /comments ERROR", () => {
  it("should send response with 404 status code", (done) => {
    request(app)
      .get("/comment")
      .set("authorization", authorization)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.status).toBe(404);
        expect(res.clientError).toBe(true);

        done();
      });
  });
});

const commentUpdate = {
  comment: "Hello update2",
};

describe("PUT /comments/:commentId ", () => {
  it("should send response with 200 status code", (done) => {
    request(app)
      .put(`/comments/${commentDataUpdate.id}`)
      .set("authorization", authorization)
      .send(commentUpdate)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.status).toBe(200);
        expect(typeof res.body).toEqual("object");
        expect(res.body.comment).toHaveProperty("comment");
        expect(res.body.comment).toHaveProperty("id");
        expect(res.type).toEqual("application/json");

        done();
      });
  });
});

const commentUpdateError = {
  comment: " ",
};

describe("PUT /comments/:commentId ERROR", () => {
  it("should send response with 404 status code", (done) => {
    request(app)
      .put(`/comments/${commentDataUpdate.id}`)
      .set("authorization", authorization)
      .send(commentUpdateError)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Column comment cannot be empty" });

        done();
      });
  });
});

describe("DELETE /comments/:commentId", () => {
  it("should send response with 200 status code", (done) => {
    request(app)
      .delete(`/comments/${commentDataUpdate.id}`)
      .set("authorization", authorization)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          message: "Your comment has been successfully deleted",
        });
        expect(res.type).toEqual("application/json");
        expect(typeof res.body).toBe("object");
        expect(res.serverError).toBe(false);

        done();
      });
  });
});

describe("DELETE /comments/:commentId ERROR", () => {
  it("should send response with 404 status code", (done) => {
    request(app)
      .delete(`/comments/77`)
      .set("authorization", authorization)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Comment Not Found" });
        expect(res.error.method).toBe("DELETE");
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

  sequelize.queryInterface
    .bulkDelete("Photos", {})
    .then(() => {
      return done();
    })
    .catch((err) => {
      done(err);
    });

  sequelize.queryInterface
    .bulkDelete("Comments", {})
    .then(() => {
      return done();
    })
    .catch((err) => {
      done(err);
    });
});
