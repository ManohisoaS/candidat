const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstname: String,
    lastname: String,
    password: String,
    email: String,
    date_naissance: Date,
    sexe: String,
    createdAt: Date,
})

module.exports = mongoose.model("User", userSchema);
