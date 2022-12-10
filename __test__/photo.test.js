const app = require("../index");
const { generateToken } = require("../helper/jwt");
const request = require("supertest");
const { sequelize } = require("../models");

const userData = {
  id: 2,
  full_name: "Budi Anto",
  email: "budi@gmail.com",
  username: "budi",
  password: "12345678",
  profile_image_url: "https://facebook.com/budianto",
  age: 25,
  phone_number: 628221355745,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const photoDataCreate = {
  id: 13,
  titel: "Photo Keluarga",
  caption: "photo keluarga waktu di pantai!",
  poster_image_url: "https://facebook.com/budianto/photo",
  UserId: userData.id,
};

const photoDataUpdate = {
  id: 5,
  titel: "Photo",
  caption: "photo keluarga!",
  poster_image_url: "https://facebook.com/budianto/photo",
  UserId: userData.id,
  createdAt: new Date(),
  updatedAt: new Date(),
};

let authorizationPhoto = "";

beforeAll((done) => {
  sequelize.queryInterface
    .bulkInsert("Users", [userData], {})
    .then(() => {
      authorizationPhoto = generateToken({
        id: userData.id,
        username: userData.username,
        email: userData.email,
      });
      done();
    })
    .catch((err) => {
      done(err);
    });

  sequelize.queryInterface
    .bulkInsert("Photos", [photoDataUpdate], {})
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

describe("POST /photos", () => {
  it("should send response with 201 status code", (done) => {
    request(app)
      .post("/photos")
      .set("authorization", authorizationPhoto)
      .send(photoDataCreate)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.status).toBe(201);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("titel");
        expect(res.body).toHaveProperty("id");
        expect(res.body.poster_image_url).toEqual(
          photoDataCreate.poster_image_url
        );

        done();
      });
  });
});

const photoDataError = {
  id: 3,
  titel: "Photo Keluarga",
  caption: "",
  poster_image_url: "https://facebook.com/budianto/photo",
  UserId: userData.id,
};

describe("POST /photos ERROR", () => {
  it("should send response with 404 status code", (done) => {
    request(app)
      .post("/photos")
      .set("authorization", authorizationPhoto)
      .send(photoDataError)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Column caption cannot be empty" });

        done();
      });
  });
});

describe("GET /photos", () => {
  it("should send response with 200 status code", (done) => {
    request(app)
      .get("/photos")
      .set("authorization", authorizationPhoto)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        console.info(res.body.photos[0].id);

        expect(res.status).toBe(200);
        expect(typeof res.body).toBe("object");
        expect(res.body.photos[0]).toHaveProperty("id");
        expect(res.body.photos[0]).toHaveProperty("UserId");
        expect(res.type).toEqual("application/json");

        done();
      });
  });
});

describe("GET /photos ERROR", () => {
  it("should send response with 404 status code", (done) => {
    request(app)
      .get("/photo")
      .set("authorization", authorizationPhoto)
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

const updatePhoto = {
  titel: "Photo Keluarga Besar",
  caption: "photo Keluarga Besar di pantai",
  poster_image_url: "https://facebook.com/budianto/photo",
};

describe("PUT /photos/:photoId ", () => {
  it("should send response with 200 status code", (done) => {
    request(app)
      .put(`/photos/${photoDataUpdate.id}`)
      .set("authorization", authorizationPhoto)
      .send(updatePhoto)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.status).toBe(200);
        expect(typeof res.body).toBe("object");
        expect(res.body.photo).toHaveProperty("id");
        expect(res.body.photo).toHaveProperty("UserId");
        expect(res.type).toEqual("application/json");

        done();
      });
  });
});

const updatePhotoError = {
  titel: " ",
  caption: "photo Keluarga Besar di pantai",
  poster_image_url: "https://facebook.com/budianto/photo",
};

describe("PUT /photos/:photoId ERROR", () => {
  it("should send response with 404 status code", (done) => {
    request(app)
      .put(`/photos/${photoDataUpdate.id}`)
      .set("authorization", authorizationPhoto)
      .send(updatePhotoError)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Column titel cannot be empty" });
        expect(res.error.method).toEqual("PUT");
        done();
      });
  });
});

describe("DELETE /photos/:photoId", () => {
  it("should send response with 200 status code", (done) => {
    request(app)
      .delete(`/photos/${photoDataUpdate.id}`)
      .set("authorization", authorizationPhoto)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          message: "Your photo has been successfully deleted",
        });
        expect(res.type).toEqual("application/json");
        expect(typeof res.body).toBe("object");
        expect(res.serverError).toBe(false);

        done();
      });
  });
});

describe("DELETE /photos/:photoId ERRRO", () => {
  it("should send response with 200 status code", (done) => {
    request(app)
      .delete(`/photos/5`)
      .set("authorization", authorizationPhoto)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        console.info(res.body);

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Photo Not Found" });
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
});
