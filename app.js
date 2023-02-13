const express = require('express')
const app = express()
const session = require('express-session')
const mongoose = require('mongoose')
const userrouter = require('./router/user-router')
const adminrouter = require('./router/admin-router')
const db = require('./utils/dbConnection')
const middleware = require('./middlewares/middleware')
const path = require('path')
const MongoStore = require('connect-mongo')
require('dotenv').config()


const oneWeek =1000 * 60 * 60 * 24 * 7

//session store
const sessionStore = MongoStore.create({
  mongoUrl: process.env.URL,
  dbName: 'TimeX',
  collectionName: 'sessions'
})

// Nocache
app.use(middleware.Cache)

//session middleware
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge:oneWeek },
  store: sessionStore
}))

//port
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//Routers
app.use('/admin', adminrouter)
app.use('/', userrouter)


//view-Engine
app.set('view engine', 'ejs')

//Static file
app.use(express.static(path.join(__dirname,('./public'))));
app.use("/uploads", express.static("uploads"));

//database and server Connection 
mongoose.set('strictQuery', true)
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`)
  })
})