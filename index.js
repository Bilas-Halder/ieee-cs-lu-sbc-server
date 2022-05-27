const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { ObjectID } = require('bson');

const mongodb = require('./mongoInit.js');


const committeeMembers = require('./routes/committeeMembers.js');
const committee = require('./routes/committee.js');
const userUpload = require('./routes/uploads.js');


require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

//middleWares
app.use(cors());
app.use(express.json());

app.use('/committee-members', committeeMembers);
app.use('/committee', committee);
app.use('/upload', userUpload);
app.use('/uploads/images', express.static('uploads/images'));


try {
    mongodb.connectToMongoServer();
}
catch (e) {
    console.log(e);
}


app.get('/', (req, res) => {
    res.send('Hello EveryOne!');
})


app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})