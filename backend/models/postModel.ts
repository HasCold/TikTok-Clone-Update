import mongoose, { Schema, model } from 'mongoose';

const postSchema = new Schema({
    originalName: {type: String, required: true, trim: true},
    fileName: {type: String, required: true, trim: true},
    filePath: {type: String, required: true, trim: true},
    fileSize: {type: String, required: true},
    text: {type: String, maxlength: 150, required: true, trim: true},
    profile_id: {type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true}
}, {
    timestamps: true,
    strict: true, // This will throw an error for extra fields
    validateBeforeSave: true  // Validate before saving
});

const postModel = model("Post", postSchema);
module.exports = postModel;