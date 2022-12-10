const { Comment } = require("../models");
const { Photo } = require("../models");
const { User } = require("../models");

class CommentControllers {
  //Create Comments
  static createComment = async (req, res) => {
    const { comment, PhotoId } = req.body;
    const loggedUserId = res.dataUser.id;

    try {
      const result = await Comment.create({
        comment,
        PhotoId,
        UserId: loggedUserId,
      });

      return res.status(201).json({ comment: result });
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

  //Get Comments
  static getComments = async (req, res) => {
    const loggedUserId = res.dataUser.id;

    try {
      const comments = await Comment.findAll({
        where: {
          UserId: loggedUserId,
        },
        include: [
          {
            model: Photo,
            attributes: {
              exclude: ["UserId", "createdAt", "updatedAt"],
            },
          },
          {
            model: User,
            attributes: ["id", "username", "profile_image_url", "phone_number"],
          },
        ],
      });

      return res.status(200).json(comments);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  };

  //Update Comments
  static updateComment = async (req, res) => {
    const commentId = req.params.commentId;
    const { comment } = req.body;

    try {
      await Comment.update(
        { comment },
        {
          where: {
            id: commentId,
          },
        }
      );

      const takeComment = await Comment.findOne({
        where: {
          id: commentId,
        },
      });

      return res.status(200).json({
        comment: takeComment,
      });
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

  //Delete Comment
  static deleteComment = async (req, res) => {
    const commentId = req.params.commentId;

    try {
      await Comment.destroy({
        where: {
          id: commentId,
        },
      });

      return res
        .status(200)
        .json({ message: "Your comment has been successfully deleted" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
}

module.exports = CommentControllers;
