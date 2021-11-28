const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    firstname: String,
    lastname: String,
    email: String,
    date_naissance: Date,
    sexe: String,
    createdAt: Date,
})

module.exports = mongoose.model("User", userSchema);
