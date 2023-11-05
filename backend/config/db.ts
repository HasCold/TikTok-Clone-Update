const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser : true,
        useUnifiedTopology : true,
        });

        console.log(colors.cyan.underline(`MongoDB Atlas successfully connected : ${conn.connection.host}`));
    } catch (error: any) {
        console.log(colors.red.bold(error.message))
        process.exit(); 
    }
}

export default connectDB;