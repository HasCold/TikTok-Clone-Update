import { Schema, model } from "mongoose";

const likeSchema = new Schema({
    profile_id: {type: String, required: true},
    post_id: {type: String, required: true},
    likedUser: {type: Boolean, required: true, default: false}
}, {
    strict: true  // This will throw an error for extra fields
})

const likeModel = model("Like", likeSchema); 
module.exports = likeModel;