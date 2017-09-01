

const moment = require("moment");
const mongoLog = require("./mongoLog");
const url = process.env.MONGO_URL;

mongoLog.putLog( { id: "test1", hoge: "example1" } , url );

mongoLog.getLog( {
  fromDate: moment().set("hour", 0).toDate(),
  toDate: moment().toDate(),
  queryOptions: {}
}, url )
.then(( l )=>{
  console.log( l );
});
