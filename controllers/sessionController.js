const { getDb } = require('../dtbase/db')

// create a new session
// @route - post in api/sessions/create

exports.createSession = async (req, res) => {
  try {
    // Destructure all expected props from req.body
    const { role, experience, topicsToFocus, description, questions, ...rest } =
      req.body

    // If you have authentication, get userId from req.user, else from body
    const userId = req.user?._id || req.body.userId

    // if (!userId) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: 'userId required' })
    // }

    // Build sessionData with all props
    const sessionData = {
      user: req?.body?.userId,
      role,
      experience,
      topicsToFocus,
      description,
      ...rest
    }
    const db = getDb()
    // Insert session first (without questions)
    const sessionResult = await db.collection('sessions').insertOne(sessionData)
    const sessionId = sessionResult.insertedId

    // Insert questions if provided
    let questionDocs = []
    if (Array.isArray(questions) && questions.length > 0) {
      questionDocs = await Promise.all(
        questions.map(async q => {
          const questionDoc = {
            session: sessionId,
            ...q
          }
          const result = await db.collection('questions').insertOne(questionDoc)
          return result.insertedId
        })
      )

      // Update session with question ids
      await db
        .collection('sessions')
        .updateOne({ _id: sessionId }, { $set: { questions: questionDocs } })
    }

    // Fetch the full session document to return
    const session = await db.collection('sessions').findOne({ _id: sessionId })
    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      session,
      questionDocs
    })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Server Error', error: err.message })
  }
}

// get all the session for the logged in user
// @route - get in api/sessions/my-sessions

// get a session by id
// @route - get in api/sessions/:id
exports.getSessionById = async (req, res) => {
  try {
    const db = getDb()
    const sessionId = req.params.id
    if (!sessionId) {
      return res
        .status(400)
        .json({ success: false, message: 'Session id required' })
    }
    const { ObjectId } = require('mongodb')
    const session = await db
      .collection('sessions')
      .findOne({ _id: new ObjectId(sessionId) })
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: 'Session not found' })
    }
    // Optionally, fetch questions for this session
    const questions = await db
      .collection('questions')
      .find({ session: new ObjectId(sessionId) })
      .toArray()
    res.json({ success: true, session, questions })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Server Error', error: err.message })
  }
}

// delete a session by id
// @route - delete in api/sessions/:id
