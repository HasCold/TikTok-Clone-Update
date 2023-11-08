import dotenv from 'dotenv';
const nodemailer = require("nodemailer")

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.ADMIN_EMAIL,  // This email is responsible to send emails to users
        pass: process.env.APP_PASSWORD
    }
});

module.exports = transporter;