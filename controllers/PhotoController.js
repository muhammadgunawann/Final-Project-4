const { Photo } = require("../models");
const { Comment } = require("../models");
const { User } = require("../models");

class PhotoControllers {
  //Post Photo
  static createPhoto = async (req, res) => {
    const { titel, caption, poster_image_url } = req.body;
    const loggedUserId = res.dataUser.id;

    try {
      const createdPhoto = await Photo.create({
        titel,
        caption,
        poster_image_url,
        UserId: loggedUserId,
      });

      const takePhoto = await Photo.findOne({
        where: {
          id: createdPhoto.id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      return res.status(201).json(takePhoto);
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(404).json({
          message: error.errors[0].message,
        });
      } else if (error.name === "SequelizeValidationError") {
        return res.status(404).json({
          message: error.errors[0].message,
        });
      } else {
        return res.status(500).json(error);
      }
    }
  };

  //Get Photo
  static getPhoto = async (req, res) => {
    const loggedUserId = res.dataUser.id;

    try {
      const getAllPhotos = await Photo.findAll({
        where: {
          UserId: loggedUserId,
        },
        include: [
          {
            model: Comment,
            attributes: ["comment"],
            include: {
              model: User,
              attributes: ["username"],
            },
          },
          {
            model: User,
            attributes: ["id", "username", "profile_image_url"],
          },
        ],
      });

      return res.status(200).json({ photos: getAllPhotos });
    } catch (error) {
      return res.status(404).json(error.message);
    }
  };

  //Update Photo
  static updatePhoto = async (req, res) => {
    const photoId = req.params.photoId;
    const { titel, caption, poster_image_url } = req.body;

    try {
      await Photo.update(
        { titel, caption, poster_image_url },
        {
          where: {
            id: parseInt(photoId),
          },
        }
      );

      const takePhoto = await Photo.findOne({
        where: {
          id: photoId,
        },
      });

      return res.status(200).json({
        photo: takePhoto,
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({
          message: error.errors[0].message,
        });
      } else if (error.name === "SequelizeValidationError") {
        return res.status(404).json({
          message: error.errors[0].message,
        });
      } else {
        return res.status(500).json(error);
      }
    }
  };

  //Delete Photo
  static deletePhoto = async (req, res) => {
    const idPhoto = req.params.photoId;

    try {
      await Photo.destroy({
        where: {
          id: +idPhoto,
        },
      });

      return res.status(200).json({
        message: "Your photo has been successfully deleted",
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}

module.exports = PhotoControllers;
