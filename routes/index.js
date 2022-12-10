const router = require("express").Router();
const UserControllers = require("../controllers/UserController")
const PhotoController = require("../controllers/PhotoController");
const commentControllers = require("../controllers/commentController")
const socialMediaControllers = require("../controllers/socialMediaController")
const authentication = require("../middleware/authentication");
const authorizationPhoto = require("../middleware/autorizationPhoto");
const authorizationUser = require("../middleware/autorizationUser");
const authorizationComment = require("../middleware/autorizationComment");
const authorizationSocialMedia = require("../middleware/authorizationSocialMedia");



// Register dan Login
router.post("/users/register", UserControllers.register);
router.post("/users/login", UserControllers.login)

// Autentikasi
router.use(authentication)

// Users
router.put("/users/:userId", authorizationUser, UserControllers.updateUser)
router.delete("/users/:userId", authorizationUser, UserControllers.deleteUser)


// Photo
router.post("/photos", PhotoController.createPhoto)
router.get("/photos", PhotoController.getPhoto)
router.put("/photos/:photoId", authorizationPhoto, PhotoController.updatePhoto)
router.delete("/photos/:photoId", authorizationPhoto, PhotoController.deletePhoto)


// Comment
router.post("/comments", commentControllers.createComment)
router.get("/comments/", commentControllers.getComments);
router.put("/comments/:commentId", authorizationComment, commentControllers.updateComment);
router.delete("/comments/:commentId", authorizationComment, commentControllers.deleteComment);


// Social Media
router.post("/socialmedias", socialMediaControllers.createSocialMedia);
router.get("/socialmedias", socialMediaControllers.getSocialMedia);
router.put("/socialmedias/:socialMediaId", authorizationSocialMedia, socialMediaControllers.updateSocialMedia);
router.delete("/socialmedias/:socialMediaId", authorizationSocialMedia, socialMediaControllers.deleteSocialMedia)



module.exports = router;