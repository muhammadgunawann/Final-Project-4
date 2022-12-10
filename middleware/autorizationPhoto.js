const {Photo} = require("../models");

const authorizationPhoto = async (req, res, next) => {
    try {
        const photoId = req.params.photoId;
        const loggedUserId = res.dataUser.id;

        const photo = await Photo.findOne({
            where: {
                id: +photoId
            }
        });

        if(!photo) {
            return res.status(404).json({message: "Photo Not Found"})
        }

        if(photo.UserId === loggedUserId) {
            next();
        }else {
            return res.status(403).json({message: "Forbidden"});
        }
    } catch (error) {
        return res.status(500).json(error.message);
    }


}



module.exports = authorizationPhoto;