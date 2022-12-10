const app = require("../index");
const { generateToken } = require("../helper/jwt");
const request = require("supertest");
const { sequelize } = require("../models");

const userData = {
  id: 10,
  full_name: "Yayan",
  email: "yayan@gmail.com",
  username: "yayan",
  password: "123456789",
  profile_image_url: "https://facebook.com/yayan/profile",
  age: 22,
  phone_number: 628221352456,
  createdAt: new Date(),
  updatedAt: new Date(),
};

socialMediaUpdate = {
  id: 10,
  name: "yayan12",
  social_media_url: "https://www.facebook.com/yayan12",
  UserId: userData.id,
  createdAt: new Date(),
  updatedAt: new Date(),
};

let authorizationSocialMedia = "";

beforeAll((done) => {
  sequelize.queryInterface
    .bulkInsert("Users", [userData], {})
    .then(() => {
      authorizationSocialMedia = generateToken({
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
    .bulkInsert("SocialMedia", [socialMediaUpdate], {})
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

socialMediaData = {
  name: "yayan_",
  social_media_url: "https://twitter/yayan",
  UserId: userData.id,
};

describe("POST /socialmedias ", () => {
  it("should send response with 201 status code", (done) => {
    request(app)
      .post("/socialmedias")
      .set("authorization", authorizationSocialMedia)
      .send(socialMediaData)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.status).toBe(201);
        expect(typeof res.body.social_media).toEqual("object");
        expect(res.body.social_media).toHaveProperty("social_media_url");
        expect(res.body.social_media).toHaveProperty("id");
        expect(res.type).toEqual("application/json");

        done();
      });
  });
});

socialMediaDataError = {
  name: "yayan_123",
  social_media_url: "",
  UserId: userData.id,
};

describe("POST /socialmedias ERROR", () => {
  it("should send response with 404 status code", (done) => {
    request(app)
      .post("/socialmedias")
      .set("authorization", authorizationSocialMedia)
      .send(socialMediaDataError)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.status).toBe(404);
        expect(res.body).toEqual({
          message: "Column social media url cannot be empty",
        });

        done();
      });
  });
});

describe("GET /socialmedias ", () => {
  it("should send response with 200 status code", (done) => {
    request(app)
      .get("/socialmedias")
      .set("authorization", authorizationSocialMedia)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        console.info(res.body);

        expect(res.status).toBe(200);
        expect(typeof res.body.social_media).toEqual("object");
        expect(res.body.social_media[0]).toHaveProperty("social_media_url");
        expect(res.body.social_media[0]).toHaveProperty("id");
        expect(res.type).toEqual("application/json");

        done();
      });
  });
});

describe("GET /socialmedias ERROR", () => {
  it("should send response with 404 status code", (done) => {
    request(app)
      .get("/socialmedia")
      .set("authorization", authorizationSocialMedia)
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

socialMediaDataUpdate = {
  name: "yayan12",
  social_media_url: "https://instagram.com/yayan12",
  UserId: userData.id,
};

describe("PUT /socialmedias ", () => {
  it("should send response with 200 status code", (done) => {
    request(app)
      .put(`/socialmedias/${socialMediaUpdate.id}`)
      .set("authorization", authorizationSocialMedia)
      .send(socialMediaDataUpdate)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.status).toBe(200);
        expect(typeof res.body.social_media).toEqual("object");
        expect(res.body.social_media).toHaveProperty("social_media_url");
        expect(res.body.social_media).toHaveProperty("id");
        expect(res.type).toEqual("application/json");

        done();
      });
  });
});

socialMediaDataUpdateError = {
  name: "",
  social_media_url: "https://instagram.com/yayan12",
  UserId: userData.id,
};

describe("PUT /socialmedias ERROR", () => {
  it("should send response with 404 status code", (done) => {
    request(app)
      .put(`/socialmedias/${socialMediaUpdate.id}`)
      .set("authorization", authorizationSocialMedia)
      .send(socialMediaDataUpdateError)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Column name cannot be empty" });
        expect(res.error.method).toEqual("PUT");

        done();
      });
  });
});

describe("DELETE /socialmedias ", () => {
  it("should send response with 200 status code", (done) => {
    request(app)
      .delete(`/socialmedias/${socialMediaUpdate.id}`)
      .set("authorization", authorizationSocialMedia)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          message: "Your social media has been successfully deleted",
        });
        expect(res.type).toEqual("application/json");
        expect(typeof res.body).toBe("object");
        expect(res.serverError).toBe(false);

        done();
      });
  });
});

describe("DELETE /socialmedias ERROR", () => {
  it("should send response with 404 status code", (done) => {
    request(app)
      .delete(`/socialmedias/8`)
      .set("authorization", authorizationSocialMedia)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "Social media Not Found" });
        expect(res.type).toEqual("application/json");

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
    .bulkDelete("SocialMedia", {})
    .then(() => {
      return done();
    })
    .catch((err) => {
      done(err);
    });
});
