const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    _memId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Member",
    },
    email: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
        index: true,
    },
    expireAt: {
        type: Date,
        default: Date.now,
        expires: 300,
    },
});

module.exports = mongoose.model("memberVerificationToken", tokenSchema);
