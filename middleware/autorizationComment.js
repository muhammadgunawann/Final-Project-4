const {Comment} = require("../models");

const authorizationComment = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        const loggedUserId = res.dataUser.id;

        const comment = await Comment.findOne({
            where: {
                id: +commentId
            }
        });

        if(!comment) {
            return res.status(404).json({message: "Comment Not Found"})
        }

        if(comment.UserId === loggedUserId) {
            next();
        }else {
            return res.status(403).json({message: "Forbidden"});
        }
    } catch (error) {
        return res.status(500).json(error);
    }
}


module.exports = authorizationComment;