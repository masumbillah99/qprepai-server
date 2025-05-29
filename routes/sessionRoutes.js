const express = require('express')
const {
  createSession,
  getSessionById,
  deleteSessionById,
  getMySessions // add this import
} = require('../controllers/sessionController')

const router = express.Router()

// session create / post
router.post('/create', createSession)

// my session get
router.get('/my-sessions', getMySessions)

// session get by id
router.get('/:id', getSessionById)

// session delete by id
router.delete('/:id', deleteSessionById)

module.exports = router
