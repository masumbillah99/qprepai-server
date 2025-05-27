const express = require('express')
const { createSession, getSessionById } = require('../controllers/sessionController')

const router = express.Router()

// session create / post
router.post('/create', createSession)

// my session get

// session get by id
router.get('/:id', getSessionById)

// session delete by id

module.exports = router
