import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import Joi from 'joi';
import { stripHtml } from 'string-strip-html';
import dayjs from 'dayjs';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(process.env.DATABASE_URL);
mongoClient.connect()
  .catch((e) => console.log(e.message));

const db = mongoClient.db();

app.listen(5000, () => console.log('Server is running on http://localhost:5000/'));