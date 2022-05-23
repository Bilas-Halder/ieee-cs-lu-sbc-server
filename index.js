const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { ObjectID } = require('bson');

const mongodb = require('./mongoInit.js');


const committee = require('./routes/committee.js');
const userUpload = require('./routes/uploads.js');


require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

//middleWares
app.use(cors());
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader(
//         'Access-Control-Allow-Headers',
//         'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//     );
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');

//     next();
// });
app.use(express.json());

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