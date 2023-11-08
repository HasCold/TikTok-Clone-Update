const jwt = require ("jsonwebtoken");
const dotenv = require ("dotenv");

dotenv.config();

 const generateToken = (id: string) => {
    return jwt.sign({id}, process.env.JWT_SECRET_KEY, {
        expiresIn: "10d"
    })
}

const resetPasswordToken = (id: string, expiry: string) => {
    return jwt.sign({id}, process.env.JWT_SECRET_KEY, {
        expiresIn: expiry
    })
}


module.exports = generateToken, resetPasswordToken;