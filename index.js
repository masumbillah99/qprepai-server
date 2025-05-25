const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb')
const { connectDB } = require('./dtbase/db')
const port = process.env.PORT || 5000

const authRoutes = require('./routes/auth')
const sessionRoutes = require('./routes/sessionRoutes')

// middleware
app.use(cors())
app.use(express.json())

// call mongodb
connectDB()

/** routes start here */

// auth routes
app.use('/api/auth', authRoutes)

// sesstion routes
app.use('/api/sessions', sessionRoutes)
// questions routes
// ai generate questions routes
// ai generate explanation routes

/** routes end here */

// server start
app.get('/', (req, res) => {
  res.send('Server is idle. Do the work')
})

app.listen(port, () => {
  console.log(`Server is running on port - ${port}`)
})
