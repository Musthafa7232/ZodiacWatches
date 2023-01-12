const mongoose  = require("mongoose")
require('dotenv').config()

mongoose.set('strictQuery', true)

mongoose.connect(process.env.URL)
.then(console.log("db connected Successfully"))
.catch((err)=>{
    console.log(err);
})

module.exports=mongoose.connection