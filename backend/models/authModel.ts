import {Schema, model} from "mongoose";
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
    name: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    image: {type: String, required: true, default: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"},
    password: {type: String, required: true, select: false},
    confirmPassword: {type: String, required: true},
    resetToken: {type: String}
},{
    timestamps: true,
    strict: true, // This will throw an error for extra fields
    validateBeforeSave: true  // Validate before saving
});

// For comparing the password we will use the bcrypt module in node.js
userSchema.methods.matchPassword = async function (enterredPassword : string, userPassword: string){
    return await bcrypt.compare(enterredPassword, userPassword)
}

const UserModel = model("User", userSchema);
module.exports = UserModel;