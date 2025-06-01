require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const { connectDB } = require('./dtbase/db')

const authRouter = require('./routes/auth')
const sessionRoutes = require('./routes/sessionRoutes')
const questionRoutes = require('./routes/questionRoutes')
const aiRoute = require('./routes/aiRoute')

const port = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: 'https://qprepai.vercel.app',
    credentials: true
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(cookieParser())

// Routes
app.use('/api/auth', authRouter)
app.use('/api/sessions', sessionRoutes)
app.use('/api/questions', questionRoutes)
app.use('/api/ai', aiRoute)

// Root route
app.get('/', (req, res) => {
  res.send('Server is idle. Do the work')
})

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Internal Server Error' })
})

// Start server
app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`)
  await connectDB()
})
