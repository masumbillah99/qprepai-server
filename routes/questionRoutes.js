const express = require('express')
const {
  addQuestionSessions,
  togglePinQuestion
} = require('../controllers/questionController')

const router = express.Router()

router.post('/add', addQuestionSessions)
router.post('/:id/pin', togglePinQuestion)

module.exports = router
