const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@${process.env.USER_NAME}.q5ntm0w.mongodb.net/?retryWrites=true&w=majority`

// Create a MongoClient with
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

let db

async function connectDB () {
  try {
    await client.connect()
    // Use your app's database, not 'admin'
    db = client.db(`${process.env.USER_NAME}`)
    await db.command({ ping: 1 })
    console.log(console.log('✅ MongoDB Connected'))
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err)
    process.exit(1)
  }
}

function getDb () {
  if (!db) {
    throw new Error('Database not initialized!')
  }
  return db
}

module.exports = { connectDB, getDb }

/** 
  // const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@qprepaiapp.q5ntm0w.mongodb.net/?retryWrites=true&w=majority`

// // Create a MongoClient with
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true
//   }
// })

// let db

// async function connectToMongo () {
//   try {
//     await client.connect()
//     db = client.db('admin')
//     await db.command({ ping: 1 })
//     console.log(
//       'Pinged your deployment. You successfully connected to MongoDB!'
//     )
//   } catch (err) {
//     console.error('Failed to connect to MongoDB:', err)
//     process.exit(1)
//   }
// }
*/
