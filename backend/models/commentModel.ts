import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    post_id: {type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true}, // Associated with Post Model
    profile_id: {type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true}, // Associated with Profile Model
    comment: {type: String, required: true, trim: true},
}, {
    timestamps: true,
    strict: true, // This will throw an error for extra fields
    validateBeforeSave: true  // Validate before saving
});

const commentModel = mongoose.model("Comment", commentSchema);
module.exports = commentModel;