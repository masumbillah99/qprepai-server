const { getDb } = require('../dtbase/db')
const { ObjectId } = require('mongodb')

// add additional questions to an existing session
// @route - /api/questions/add
const addQuestionSessions = async (req, res) => {
  try {
    const db = getDb()
    const { sessionId, questions } = req.body
    if (!sessionId || !questions) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid input data' })
    }

    // Check if the session exists
    const session = await db
      .collection('sessions')
      .findOne({ _id: new ObjectId(sessionId) })
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: 'Session not found' })
    }

    // create new questions
    const createdQuestionsResult = await db.collection('questions').insertMany(
      questions.map(q => ({
        session: new ObjectId(sessionId),
        question: q.question,
        answer: q.answer
      }))
    )
    const createdQuestions = Object.values(
      createdQuestionsResult.insertedIds
    ).map((id, idx) => ({
      _id: id,
      ...questions[idx],
      session: new ObjectId(sessionId)
    }))

    // update session with new questions IDs
    const newQuestionIds = Object.values(createdQuestionsResult.insertedIds)
    await db
      .collection('sessions')
      .updateOne(
        { _id: new ObjectId(sessionId) },
        { $push: { questions: { $each: newQuestionIds } } }
      )

    res.status(201).json({ success: true, questions: createdQuestions })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Server Error', error: err.message })
  }
}

// pin or unpin a question
// @route - /api/questions/:id/pin
const togglePinQuestion = async (req, res) => {}

module.exports = { addQuestionSessions, togglePinQuestion }
