const MongoClient = require('mongodb').MongoClient;

var _db;

module.exports = {

    connectToMongoServer: () => {
        const uri = process.env.DB_URI;

        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        try {
            client.connect();
            _db = client.db('IEEE-CS-LU-SBC');
        }
        catch (e) {
            throw e;
        }
    },

    getDatabase: () => {
        return _db;
    }
};