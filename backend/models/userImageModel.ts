import mongoose from 'mongoose';

const userImage = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true},
    originalName: {type: String, required: true},
    fileName: {type: String, required: true},
    filePath: {type: String, required: true},
    fileSize: {type: String, required: true},

}, {
    strict: true, // This will throw an error for extra fields
    validateBeforeSave: true  // Validate before saving
});

module.exports = mongoose.model("UserImage", userImage);