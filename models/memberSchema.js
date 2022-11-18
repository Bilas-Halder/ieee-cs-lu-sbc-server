const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            index: {unique: true},
        },
        password: {
            type: String,
            required: true,
        },
        membershipID: String,
        passingYear: String,
        imgUrl: {
            type: String,
            default: "https://i.ibb.co/FzCXQJH/ieee-Default-Avater.jpg",
        },
        batch: String,
        description: String,
        type: {
            type: String,
            enum: ["local", "global", "guest"],
            default: "guest",
        },
        contact: {
            website: String,
            linkedin: String,
            github: String,
            email: String,
            phone: String,
            facebook: String,
        },
        verified: {
            type: Boolean,
            default: 0,
        },
        role: {
            type: String,
            enum: ["user", "admin", "moderator"],
            default: "user",
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("Member", memberSchema);
