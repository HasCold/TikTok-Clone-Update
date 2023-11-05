const mongoose = require ("mongoose");

const profileSchema = new mongoose.Schema({
    user_id: {type: String, required: true},  // This is associated with the User model id 
    image: {type: String, required: true, default: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"},
    bio: {type: String, maxlength: 150, trim: true, default: " "},
    name: {type: String, required: true},
}, {
    strict: true, // This will throw an error for extra fields
    validateBeforeSave: true  // Validate before saving
});

profileSchema.methods.getImage = async function(){
    return profileSchema.image;
}

const profileModel = mongoose.model("Profile", profileSchema);
module.exports= profileModel;