const { User } = require("../models");
const { comparePassword } = require("../helper/bcrypt");
const { generateToken } = require("../helper/jwt");

class UserControllers {
    //Register
    static register = async (req, res) => {

        const {full_name, email, username, password, profile_image_url, age, phone_number} = req.body;
   
        try {
            const newUser = await User.create({
                full_name,
                email,
                username,
                password,
                profile_image_url,
                age: parseInt(age),
                phone_number: parseInt(phone_number)
                
            })    

            return res.status(201).json({
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    full_name: newUser.full_name,
                    username: newUser.username,
                    profile_image_url: newUser.profile_image_url,
                    age: newUser.age,
                    phone_number: parseInt(newUser.phone_number)
                }
                
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

    //Login
    static login = async (req, res) => {
        const {email, password} = req.body;

        try {
            const dataUser = await User.findOne({
                where: {
                    email: email
                }
            });

            if(dataUser) {
                const isCorrect = comparePassword(password, dataUser.password);
                
                if(isCorrect) {
                    const token = generateToken({
                        id: dataUser.id,
                        username: dataUser.username,
                        email: dataUser.email
                    })

                    res.status(200).json({token: token})
                }else {
                    res.status(400).json({message: "Wrong Password"})
                }
            }else {
                res.status(400).json({message: "Email Not Found"})
            }
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }


    //Update UserById
    static updateUser = async (req, res) => {
        const userId = req.params.userId;
        const {full_name, email, username, profile_image_url, age, phone_number} = req.body;

        try {
            await User.update({full_name, email, username, profile_image_url, age, phone_number}, {
                where: {
                    id: parseInt(userId)
                }
            })

            const updateUser = await User.findOne({
                where: {
                    id: parseInt(userId)
                },
                attributes: {
                    exclude: ["id", "password", "createdAt", "updatedAt"]
                }
            })

            return res.status(200).json({
                user: updateUser
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
                return res.status(500).json(error.message)
            }
        }

        
    }


    //delete userById
    static deleteUser = async (req, res) => {
        const userId = req.params.userId;

        try {
            await User.destroy({
                where: {
                    id: +userId
                }
            });

            return res.status(200).json({
                message: "Your account has been successfully deleted"
            })
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    }

}





module.exports = UserControllers;
