const mongoose = require('mongoose');

const executiveCommitteeSchema = new mongoose.Schema({
    year: {
        type: String,
        // required: true
    },
    data: [
        {
            des: {
                type: String,
                // required: true
            },
            priority: {
                type: Number,
                // required: true
            },
            mID: {
                type: String,
                required: true
            }
        }
    ],
    period: {
        type: String,
        required: true
    }

});

module.exports = executiveCommitteeSchema;