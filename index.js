const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb')
const { connectDB } = require('./dtbase/db')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const port = process.env.PORT || 5000

const authRoutes = require('./routes/auth')
const sessionRoutes = require('./routes/sessionRoutes')
const questionRoutes = require('./routes/questionRoutes')
const aiRoute = require('./routes/aiRoute')

// middleware
// Correct CORS usage for credentials
app.use(
  cors({
    origin: 'http://localhost:5173', // frontend URL
    credentials: true
  })
)
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

// call mongodb

/** routes start here */

app.use('/api/auth', authRoutes)
app.use('/api/sessions', sessionRoutes)
app.use('/api/questions', questionRoutes)
app.use('/api/ai', aiRoute)

/** routes end here */

// server start
app.get('/', (req, res) => {
  res.send('Server is idle. Do the work')
})

app.listen(port, async () => {
  console.log(`Server is running on port - ${port}`)
  await connectDB()
})
