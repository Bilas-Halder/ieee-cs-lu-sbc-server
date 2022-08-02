const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    membershipID: String,
    passingYear: String,
    imgUrl: String,
    batch: String,
    description: String,
    type: {
        type: String,
        enum: ['local', 'global', 'guest'],
        required: true
    },
    contact: {
        facebook: String,
        linkedin: String,
        github: String,
        email: String,
        phone: String
    },
    account_created: {
        type: Date,
        default: Date.now
    },
    verified: Boolean

});

module.exports = memberSchema;