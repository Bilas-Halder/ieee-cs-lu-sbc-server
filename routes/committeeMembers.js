const express = require('express');
const router = express.Router();
const { ObjectID } = require('bson');

const mongodb = require('../mongoInit.js');



router.get('/', async (req, res) => {

    const database = mongodb.getDatabase();
    const committeeMembersCollection = database.collection("CommitteeMembers");

    const cursor = await committeeMembersCollection.find({});
    const member = await cursor.toArray();
    // console.log(member);
    res.json(member);
});

router.get('/:id', async (req, res) => {

    const database = mongodb.getDatabase();
    const committeeMembersCollection = database.collection("CommitteeMembers");

    const id = req.params?.id;
    const query = { _id: ObjectID(id) };
    const member = await committeeMembersCollection.findOne(query);

    res.json(member);
});
router.post('/', async (req, res) => {

    const database = mongodb.getDatabase();
    const committeeMembersCollection = database.collection("CommitteeMembers");

    const newMember = req.body;
    const result = await committeeMembersCollection.insertOne(newMember);
    res.json(result);
});

module.exports = router;