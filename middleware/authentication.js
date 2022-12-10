const {User} = require("../models");
const {verfyToken} = require("../helper/jwt");

const authentication = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const userDecode = verfyToken(token);


        const user = await User.findOne({
            where: {
                id: userDecode.id,
                username: userDecode.username
            }
        })

        if(!user) {
            return res.status(401).json({
                message: "invalid user id"
            });
        }

        res.dataUser = user;
        next();
    } catch (error) {
        return res.status(401).json(error)
    }
}




module.exports = authentication;