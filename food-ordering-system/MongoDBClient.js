const { MongoClient } = require('mongodb');
const config = require('./config');

let db = null;

class MongoDB {

    static getDb() {
        return db;
    }

    static connect() {
        console.log("Connecting to mongo server");
        return new Promise((resolve, reject) => {
            MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function (err, client) {
                if (err) return reject(err);
                console.log("Connected successfully to mongo server");
                db = client.db(config.mongodb.dbName);  
                resolve();
            });
        })
    }

    static stores() {
        return db.collection("stores");
    }

    static users(){
        return db.collection("users");
    }

    static orders(){
        return db.collection("orders");
    }

}

module.exports = MongoDB;