const {SocialMedia} = require("../models");

const authorizationSocialMedia = async (req, res, next) => {
    try {
        const socialMediatId = req.params.socialMediaId;
        const loggedUserId = res.dataUser.id;

        const socialMedia = await SocialMedia.findOne({
            where: {
                id: +socialMediatId
            }
        });

        if(!socialMedia) {
            return res.status(404).json({message: "Social media Not Found"})
        }

        if(socialMedia.UserId === loggedUserId) {
            next();
        }else {
            return res.status(403).json({message: "Forbidden"});
        }
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = authorizationSocialMedia;