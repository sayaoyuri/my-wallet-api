import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL);

try {
  await mongoClient.connect();
  console.log('MongoDB connected!');
} catch (e) {
  console.log(e.message);
}

export const db = mongoClient.db();