
const express = require("express");
const http = require("http");
const app = express();

const moment = require("moment");
const mongoLog = require("./mongoLog");
const url = process.env.MONGO_URL;

function extraQueryBuilder( req ){
  return {};//{  segment: req.query.segment || "DA" };
}
function makeLine( i ){
  return [ moment( i.timestamp ).format("YYYY/MM/DD HH:mm:ss"),
    i.segment,
    i.clientId,
    i.requestId,
    i.characterCalled,
    i.userUtterance,
    i.characterRespond,
    i.botUtterance,
    i.category ].join(",");
}


app.set( 'port', process.env.PORT || 3000 );
app.get( '/', mongoLog.expressCsvLogRoute( extraQueryBuilder, makeLine, url ) );
const server = http.createServer( app ).listen( app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});


mongoLog.getLog( {
  fromDate: moment("20170901").set("hour", 0).toDate(),
  toDate: moment().toDate(),
  queryOptions: {}
}, url )
.then(( l )=>{
  console.log( l );
});
