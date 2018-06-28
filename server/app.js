require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')))

//mongoose connection
const mongoose = require('mongoose')
const dbUrl = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds217921.mlab.com:17921/soc-med`;
mongoose.connect(dbUrl, (err) => {
  if(!err) {
    console.log('success connected to database');
  } else {
    console.log('error Connect to database');
  }
})

const userRouter = require('./routers/user_router.js')
const postRouter = require('./routers/post_router')

app.use('/user', userRouter)
app.use('/post', postRouter)

app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
})
