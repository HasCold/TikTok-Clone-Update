const jwt = require ("jsonwebtoken");
const dotenv = require ("dotenv");

dotenv.config();

 const generateToken = (id: string) => {
    return jwt.sign({id}, process.env.JWT_SECRET_KEY, {
        expiresIn: "10d"
    })
}

module.exports = generateToken;