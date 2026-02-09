const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    ispremiumuser: { type: Boolean, required: true, default: false },
    totalExpenses: { type: Number, required: true, default: 0 }
});

module.exports = mongoose.model("User", userSchema);


