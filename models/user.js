'use strict';
const { Model } = require('sequelize');
const { hashPassword } = require('../helper/bcrypt');


module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Photo);
      this.hasMany(models.Comment);
      this.hasMany(models.SocialMedia);
    }
  }
  User.init({
    full_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Column full name cannot be empty"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "email already registered"
      },
      validate: {
        notEmpty: {
          args: true,
          msg: "Column email cannot be empty"
        },
        isEmail: {
          args: true,
          msg: "Format of email address is incorrect"
        }       
      }
    },
    username: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "Username already registered"
      },
      validate: {
        notEmpty: {
          args: true,
          msg: "Column username cannot be empty"
        },
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Column password cannot be empty"
        },
        len: {
          args: [8, 255],
          msg: "please enter password 8 or more"
        }
      }
    },
    profile_image_url: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          args: true,
          msg: "Column profile image url cannot be empty "
        },
        isUrl: {
          args: true,
          msg: "Format of url address is incorrect"
        }
      }
    },
    age: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: "Column age cannot be empty"
        },
        isInt: {
          args: true,
          msg: "What you input is not a number"
        }
      }
    },
    phone_number: {
      type: DataTypes.BIGINT,
      validate: {
        notEmpty: {
          args: true,
          msg: "Column phone number cannot be empty"
        },
        isInt: {
          args: true,
          msg: "What you input is not a number"
        },
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (user, opt) => {
        const hashedPassword = hashPassword(user.password);

        user.password = hashedPassword;
      }
    }
  });
  return User;
};