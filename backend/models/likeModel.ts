import { Schema, model } from "mongoose";
const mongoose = require ("mongoose");

const likeSchema = new Schema({
    profile_id: {type: mongoose.Schema.Types.ObjectId, ref: "Profile" ,required: true},
    post_id: {type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true},
    likedUser: {type: Boolean, required: true, default: false}
}, {
    strict: true  // This will throw an error for extra fields
})

const likeModel = model("Like", likeSchema); 
module.exports = likeModel;