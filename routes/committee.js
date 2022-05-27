const express = require('express');
const router = express.Router();
const { ObjectID } = require('bson');

const mongodb = require('../mongoInit.js');



router.get('/:year', async (req, res) => {

    const database = mongodb.getDatabase();
    const committeeCollection = database.collection("ExecutiveCommittee");
    const committeeMembersCollection = database.collection("CommitteeMembers");

    const year = req.params?.year;
    const query = { year: year };
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

    res.json(response);
});

router.get('/:year/dummy', async (req, res) => {

    const database = mongodb.getDatabase();
    const committeeCollection = database.collection("ExecutiveCommittee");
    const committeeMembersCollection = database.collection("CommitteeMembers");

    const year = req.params?.year;
    const query = { year: year };
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

    const dummyData = [...response, ...response, ...response, ...response, ...response, ...response, ...response, ...response, ...response, ...response,];

    res.json(dummyData);
});

module.exports = router;