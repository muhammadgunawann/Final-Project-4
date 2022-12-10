const {User} = require("../models");

const  authorizationUser = async (req, res, next) => {
    try {
        const userId = +req.params.userId;
        const loggedUserId = res.dataUser.id;

        const user = await User.findOne({
            where: {
                id: +userId
            }
        });

        if(!user) {
            return res.status(404).json({message: "User Not Found"})
        }
    
        if(user.id === loggedUserId) {
            next();
        }else {
            return res.status(403).json({message: "Forbidden"});
        }
    } catch (error) {
        return res.status(500).json(error.message);
    }
    
    
}





module.exports = authorizationUser;