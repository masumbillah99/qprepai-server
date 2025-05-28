const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
require('dotenv').config()
const { connectDB } = require('./dtbase/db')
const port = process.env.PORT || 5000

const authRoutes = require('./routes/auth')
const sessionRoutes = require('./routes/sessionRoutes')
const questionRoutes = require('./routes/questionRoutes')
const aiRoute = require('./routes/aiRoute')

// middleware
app.use(cors())
app.use(express.json())

// call mongodb
connectDB()

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

app.listen(port, () => {
  console.log(`Server is running on port - ${port}`)
})
