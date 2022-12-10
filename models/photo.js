'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User);
      this.hasMany(models.Comment)
    }
  }
  Photo.init({
    titel: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Column titel cannot be empty"
        }
      }
    },
    caption: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          args: true,
          msg: "Column caption cannot be empty"
        }
      }
    },
    poster_image_url: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          args: true,
          msg: "Column poster image url cannot be empty"
        },
        isUrl: {
          args: true,
          msg: "Format of url address is incorrect"
        }
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Photo',
  });
  return Photo;
};