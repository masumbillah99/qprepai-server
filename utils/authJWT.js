// This function verifies the JWT token from cookies and retrieves the user from the database.

const jwt = require('jsonwebtoken')
const { getDb } = require('../dtbase/db')

async function verifyUserFromToken (req, res) {
  const token = req.cookies.token
  if (!token) {
    res.status(401).json({ success: false, message: 'Unauthorized: No token' })
    return null
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const db = getDb()
    const user = await db.collection('users').findOne({ email: decoded.email })

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' })
      return null
    }

    return user
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' })
    return null
  }
}

module.exports = { verifyUserFromToken }
