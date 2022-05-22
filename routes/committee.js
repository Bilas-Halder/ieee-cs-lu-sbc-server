const express = require('express');
const router = express.Router();
const { ObjectID } = require('bson');

const mongodb = require('../mongoInit.js');



router.get('/:id', async (req, res) => {

    const database = mongodb.getDatabase();
    const committeeCollection = database.collection("ExecutiveCommittee");
    const committeeMembersCollection = database.collection("CommitteeMembers");

    const id = req.params?.id;
    const query = { year: id };
    const committee = await committeeCollection.findOne(query);
    const data = committee.data;

    data.sort((a, b) => a.priority < b.priority ? -1 : 1);

    const response = await Promise.all(
        data.map(async (d) => {
            const uID = d.uID;
            const q = { _id: ObjectID(uID) };
            const mem = await committeeMembersCollection.findOne(q);

            mem.designation = d.des;
            mem.priority = d.priority;
            mem.period = committee.period;
            mem.year = committee.year;

            return mem;
        })
    );

    console.log(response);

    res.json(response);
});

module.exports = router;