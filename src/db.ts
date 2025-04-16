import { MongoClient, Db } from "mongodb";

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017'
let dbInstance: Db | null = null

export async function connectToDb() {
  const client = new MongoClient(MONGO_URI)
  await client.connect()
  console.log('Connected to MongoDB')
  dbInstance = client.db('testdb')
  return dbInstance
}
