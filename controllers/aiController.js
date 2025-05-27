// Use dynamic import for ESM module
let GoogleGenAI, ai
async function getAI () {
  if (!GoogleGenAI) {
    GoogleGenAI = (await import('@google/genai')).GoogleGenAI
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  }
  return ai
}
const {
  questionAnswerPrompt,
  conceptExplainPrompt
} = require('../utils/prompt')

// @desc generate interview questions and answeres using Gemini AI
// @route POST /api/ai/generate-questions
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body
    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: 'Missing required fields' })
    }
    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicsToFocus,
      numberOfQuestions
    )
    const ai = await getAI()
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: prompt
    })
    let rawText = response.text
    const cleanedText = rawText
      .replace(/^```json\s*/, '')
      .replace(/```$/, '')
      .trim()
    let data
    try {
      data = JSON.parse(cleanedText)
    } catch (e) {
      return res.status(500).json({
        message: 'Failed to parse AI response',
        error: e.message,
        raw: rawText
      })
    }
    res.json({ data })
  } catch (err) {
    res.status(500).json({
      message: 'Failed to generate questions',
      error: err.message
    })
  }
}

// @desc generate explains a interview questions
// @route POST /api/ai/generate-explanation
const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body

    if (!question) {
      return res.status(400).json({ message: 'Missing question field' })
    }

    const prompt = conceptExplainPrompt(question)
    const ai = await getAI()
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: prompt
    })

    let rawText = response.text
    // Clean it: Remove ```json and ``` from beginning and end
    const cleanedText = rawText
      .replace(/^```json\s*/, '') // remove starting ```json
      .replace(/```$/, '') // remove ending ```
      .trim() // remove extra whitespace

    // now safe to parse
    const data = JSON.parse(cleanedText)
    res.status(200).json(data)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to generate explanation', error: err.message })
  }
}

module.exports = { generateInterviewQuestions, generateConceptExplanation }
