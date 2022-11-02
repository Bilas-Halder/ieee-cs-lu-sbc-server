const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    image: {
        type: String,
    },
    date: {
        type: String,
    },
    time: {
        type: String,
    },
    objective: String

});

module.exports = eventSchema;