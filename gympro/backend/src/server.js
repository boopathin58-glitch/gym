require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const http = require('http')
const connectDB = require('./config/db')

const app = express()
const server = http.createServer(app)

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:5173',
].filter(Boolean)

app.use(helmet())
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true)
    else callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'))

const limiter = rateLimit({
  windowMs: 900000,
  max: 100,
  message: { success: false, message: 'Too many requests.' }
})
app.use('/api/', limiter)

app.use('/api/auth',       require('./routes/auth.routes'))
app.use('/api/users',      require('./routes/user.routes'))
app.use('/api/progress',   require('./routes/progress.routes'))
app.use('/api/membership', require('./routes/membership.routes'))
app.use('/api/workouts',   require('./routes/workout.routes'))
app.use('/api/classes',    require('./routes/class.routes'))
app.use('/api/analytics',  require('./routes/analytics.routes'))

// Health check — Render pings this to verify the service is up
app.get('/',         (req, res) => res.json({ success: true, message: 'GymPro API is running!' }))
app.get('/api/health', (req, res) => res.json({ success: true, message: 'GymPro API is running!', env: process.env.NODE_ENV }))

app.use((req, res) => res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` }))
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error.' })
})

const PORT = process.env.PORT || 5000

// Connect DB then start — crash clearly if MONGO_URI is missing
const start = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI environment variable is not set!')
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET environment variable is not set!')
    if (!process.env.JWT_REFRESH_SECRET) throw new Error('JWT_REFRESH_SECRET environment variable is not set!')

    await connectDB()

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ GymPro API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`)
    })
  } catch (err) {
    console.error('❌ Startup error:', err.message)
    process.exit(1)
  }
}

start()
module.exports = { app, server }
