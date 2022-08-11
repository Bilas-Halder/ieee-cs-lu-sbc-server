const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const eventSchema = require('../schemas/eventSchema');

const Event = mongoose.model('Event', eventSchema);




router.get('/', (req, res) => {
    Event.find({}, (err, events) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(events);
        }
    });
});



router.post('/', (req, res) => {
    console.log(req.body);
    const event = new Event({ ...req.body });
    event.save((err, event) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(event);
        }
    }
    );
});

router.post('/many', (req, res) => {
    const events = req.body;
    Event.insertMany(events, (err, events) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(events);
        }
    });
});




module.exports = router;