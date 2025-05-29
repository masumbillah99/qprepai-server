const express = require('express')
const { generateInterviewQuestions, generateConceptExplanation } = require('../controllers/aiController')

const router = express.Router()

// POST /api/ai/generate-questions
router.post('/generate-questions', generateInterviewQuestions)

// POST /api/ai/generate-explanation
router.post('/generate-explanation', generateConceptExplanation)

module.exports = router
