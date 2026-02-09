const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const forgotpasswordrequestSchema = new Schema({
    uuid: {type: String, required: true },
    active: { type: Boolean,required: true},
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" }
});

module.exports = mongoose.model("ForgotPasswordRequest", forgotpasswordrequestSchema);
