import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import connectDB from './config/db';
const authRoute = require("./routes/authRoute");
const profileRoute = require("./routes/profileRoute");
const uploadImageRoute = require("./routes/uploadImageRoute");
const postRoute = require ("./routes/postRoute");
const commentRoute = require ("./routes/commentRoute");
const likeRoute = require ("./routes/likeRoute");
const cors = require("cors");

dotenv.config();

const app = express();   // app instance by invoking the express() function. This instance is the foundation of you web-application;
connectDB();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Server to accept the json data from frontend
app.use(cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    credentials: true, // You may need this depending on your use case
}));
app.use('/uploadedImage', express.static('uploadedImage'));  // set the images path to the frontend
app.use('/uploadedVideos', express.static('uploadedVideos')); // express.static(): This function is used to serve static files in Express. It takes one argument, which is the directory from which you want to serve static files. In this case, 'uploadedVideos' is the directory where your video files are stored.
// app.use('/uploadedVideos', ...): This line specifies that any incoming HTTP request to a route that starts with /uploadedVideos will be handled by the static file serving middleware.

app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);
app.use("/api/uploads", uploadImageRoute);
app.use("/api/post", postRoute);
app.use("/api/comment", commentRoute);
app.use("/api/like", likeRoute);

app.listen(PORT, (): void => {
    console.log(colors.bgYellow.bold(`Server is running on port: ${PORT}`));
});

// app.get('/', (req:Request, res: Response) => {
//     res.send("API is running");
// })
