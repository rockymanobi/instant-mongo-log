
# Example

```js
const moment = require("moment");
const mongoLog = require("./mongoLog");
const url = process.env.MONGO_URL;

const logContent = { id: "test1", hoge: "example1" };
mongoLog.putLog( logContent, url );

mongoLog.getLog({
  queryOptions: {},  // options for mongodb#find
  fromDate: moment().set("hour", 0).toDate(), // Date
  toDate: moment().toDate(), // Date
}, url )
.then(( l )=>{
  console.log( l );
});
```
