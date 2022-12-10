const bcrypt = require("bcrypt");

const hashPassword = (userPassword) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(userPassword, salt);

    return hashedPassword;
}


const comparePassword = (userPassword, hashedPassword) => {
    return bcrypt.compareSync(userPassword, hashedPassword);
};


module.exports = {
    hashPassword,
    comparePassword
}