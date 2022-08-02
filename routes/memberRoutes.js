const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const memberSchema = require('../schemas/memberSchema');

const Member = mongoose.model('Member', memberSchema);


router.get('/', (req, res) => {
    Member.find({}, (err, members) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(members);
        }
    });
});

router.get('/emails', async (req, res) => {
    // Member.find({})
    //     .select({
    //         email: 1,// will return only email & _id
    //     })
    //     .exec((err, data) => {
    //         if (err) {
    //             res.status(500).send(err);
    //         } else {
    //             res.status(200).send(data);
    //         }
    //     });

    // can be handled this way too
    try {
        const members = await Member.find({})
            .select({
                email: 1,// will return only email & _id
            });
        res.status(200).send(members);
    }
    catch (err) {
        res.status(500).send(err);
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const member = await Member.findById(id);
        res.status(200).send(member);
    }
    catch (err) {
        res.status(500).send(err);
    }
});

// Post
router.post('/', (req, res) => {
    const member = new Member({ ...req.body });
    member.save((err, member) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(member);
        }
    });
});

router.post('/many', (req, res) => {
    const members = req.body;
    Member.insertMany(members, (err, members) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(members);
        }
    });
});

// Update
router.put('/:id', (req, res) => {
    const id = req.params.id;
    Member.findByIdAndUpdate(
        { _id: id },
        { $set: req.body },
        {
            useFindAndModify: false,
            new: true // to return the updated document
        },

        (err, member) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(member);
            }
        });
});


module.exports = router;