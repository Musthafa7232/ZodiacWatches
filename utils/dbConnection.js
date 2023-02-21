const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', true)
mongoose.connect(process.env.URL)
  .then(() => {
    console.log('Connected to database')
  })
  .catch(error => {
    console.log("Couldn't connect to database")
    console.log(error)
  })

module.exports = mongoose.connection
