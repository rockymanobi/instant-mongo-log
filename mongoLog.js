
const moment = require("moment");
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

      console.log( queryOptions );
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


function expressCsvLogRoute( extraQueryBuilder, formatter, mongoUrl ){

  return function(req,res){
    console.log( "hello" );

    const fromDate = moment( req.query.date ).set({ hour: 0, minute: 0, seconds: 0}).toDate();
    const toDate = moment( req.query.date ).set({ hour: 23, minute: 59, seconds: 59}).toDate();
    console.log( fromDate );
    console.log( toDate );
    console.log( extraQueryBuilder( req ) );
  
    getLog({
      queryOptions : extraQueryBuilder( req ),
      fromDate,
      toDate,
    }, mongoUrl).then((docs)=>{
      //console.log(docs);
      const lines = docs.map( doc => formatter( doc )).join("\r\n");
      var jconv = require( 'jconv' );
      res.attachment('filename.csv');
  
      if( req.query.code === "sjis" ){
        res.setHeader( 'Content-Type', 'text/csv; charset=Shift_JIS' );
        res.write( jconv.convert( lines , 'UTF8', 'SJIS' ) ) ;
      }else{
        res.setHeader( 'Content-Type', 'text/csv; charset=UTF-8' );
        res.write( lines  );
      }
      res.end();
    })
    .catch((e)=>{
      res.status(500);
      res.send( JSON.stringify(e) );
    });
  };
}




module.exports = {
  putLog : putLog,
  getLog : getLog,
  expressCsvLogRoute: expressCsvLogRoute,
};

