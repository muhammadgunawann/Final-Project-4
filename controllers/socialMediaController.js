const { SocialMedia } = require("../models");
const { User } = require("../models");


class SocialMediaControllers {
    //Create Social Media
    static createSocialMedia = async (req, res) => {
        const {name, social_media_url} = req.body;
        const loggedUserId = res.dataUser.id;

        try {
            const newSocialMedia = await SocialMedia.create({
                name,
                social_media_url,
                UserId: loggedUserId
            });

            return res.status(201).json({
                social_media: newSocialMedia
            })

        } catch (error) {
            if(error.name === "SequelizeUniqueConstraintError") {
                return res.status(404).json({
                    message: error.errors[0].message
                })
            }else if(error.name === "SequelizeValidationError") {
                return res.status(404).json({
                    message: error.errors[0].message
                })
            }else{ 
                return res.status(500).json(error)
            }
        }
    }


    //Get Social Media
    static getSocialMedia = async (req, res) => {
        const loggedUserId = res.dataUser.id;

        try {
            const takeSocialMedias = await SocialMedia.findAll({
                where: {
                    UserId: loggedUserId
                },
                include: {
                    model: User,
                    attributes: ["id", "username", "profile_image_url"]
                }
            });

            return res.status(200).json({
                social_media: takeSocialMedias
            })
        } catch (error) {
            return res.status(404).json(error.message);
        }
    }


    //Update Social Media
    static updateSocialMedia = async (req, res) => {
        const socialMediaId = req.params.socialMediaId;
        const {name, social_media_url} = req.body;

        try {
            await SocialMedia.update({name, social_media_url}, {
                where: {
                    id: socialMediaId
                }
            });

            const takeSocialMedia = await SocialMedia.findOne({
                where: {
                    id: socialMediaId
                }
            })

            return res.status(200).json({
                social_media: takeSocialMedia
            })
        } catch (error) {
            if(error.name === "SequelizeUniqueConstraintError") {
                return res.status(404).json({
                    message: error.errors[0].message
                })
            }else if(error.name === "SequelizeValidationError") {
                return res.status(404).json({
                    message: error.errors[0].message
                })
            }else{ 
                return res.status(500).json(error)
            }
        }
    }

    
    //Delete Social Media
    static deleteSocialMedia = async (req, res) => {
        const socialMediaId = req.params.socialMediaId;

        try {
            await SocialMedia.destroy({
                where: {
                    id: socialMediaId
                }
            });

            return res.status(200).json({
                message: "Your social media has been successfully deleted"
            })
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}

module.exports = SocialMediaControllers;