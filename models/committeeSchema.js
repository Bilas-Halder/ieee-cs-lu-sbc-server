const mongoose = require("mongoose");

const committeeSchema = new mongoose.Schema(
    {
        year: {
            type: String,
            required: true,
            index: {unique: true},
        },
        membersList: [
            {
                _id: false,
                designation: {
                    type: String,
                    required: true,
                },
                priority: {
                    type: Number,
                    required: true,
                },
                member: {
                    type: mongoose.Types.ObjectId,
                    ref: "Member",
                    required: true,
                },
            },
        ],
        period: {
            type: String, //"Feb 2022 - Fab 2023"
            required: true,
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("Committee", committeeSchema);
