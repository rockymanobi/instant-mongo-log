
const MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
function putLog( value, url ){
  MongoClient.connect( url , function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    if( value && !value.timestamp){
      value.timestamp = new Date().getTime();
    }

    insertDocuments("botlog", value, db, function() {
      db.close();
    });
  });
}

function getLog( options, url ){
  const fromDate = options.fromDate;
  const toDate = options.toDate;
  const queryOptions = options.queryOptions || {};

  return new Promise((resolve, reject)=>{

    MongoClient.connect( url , function(err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");
      queryOptions.timestamp = { $gt : fromDate.getTime(), $lt: toDate.getTime() };

      const collection = db.collection('botlog');
      collection.find( queryOptions ).toArray(function(err, docs) {
        if( err ){ return reject(err); }
        resolve(docs);
        console.log("Found the following records");
      });
    });
  });
}

// Use connect method to connect to the Server
var insertDocuments = function(collectionName, value ,db, callback) {
  // Get the documents collection
  var collection = db.collection( collectionName );
  // Insert some documents
  collection.insertMany([
    value
  ], function(err, result) {
    assert.equal(err, null);
    console.log("log inserted");
    callback(result);
  });
}

module.exports = {
  putLog : putLog,
  getLog : getLog,
};

