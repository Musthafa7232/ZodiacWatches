const express = require('express')
const app = express()
const session = require('express-session')
const mongoose = require('mongoose')
const userrouter = require('./router/user-router')
const adminrouter = require('./router/admin-router')
const db = require('./utils/dbConnection')
const middleware = require('./middlewares/middleware')
const path = require('path')

require('dotenv').config()

app.use(middleware.Cache)

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }// 1 week
}))


//port
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//Routers
app.use('/', userrouter)
app.use('/admin', adminrouter)

//view-Engine
app.set('view engine', 'ejs')

//Static file
app.use(express.static(path.join(__dirname , 'public')));

//database and server Connection 
mongoose.set('strictQuery', true)
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`)
  })
})