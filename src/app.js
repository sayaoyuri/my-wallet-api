import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import Joi from 'joi';
import { stripHtml } from 'string-strip-html';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(process.env.DATABASE_URL);
mongoClient.connect()
  .catch((e) => console.log(e.message));

const db = mongoClient.db();

app.post('/cadastro', async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required()
  });

  const requestData = {};
  try {
    requestData.name = stripHtml(req.body.name).result.trim();
    requestData.email = stripHtml(req.body.email).result.trim();
    requestData.password = stripHtml(req.body.password).result.trim();
  } catch(e) {
    return res.status(422).send('Todos os campos são obrigatórios!');
  }
  
  const { error } = schema.validate(requestData, { abortEarly: false });
  if(error) return res.status(422).send(error.details.map(e => e.message));

  try {
    const user = await db.collection('users').findOne({ email: requestData.email })
    if(user) return res.status(409).send('E-mail já cadastrado!');

    requestData.password = bcrypt.hashSync(requestData.password, 10);

    const newUser = await db.collection('users').insertOne(requestData);
    if(newUser.acknowledged) return res.status(201).send('Cadastro realizado com sucesso!');
  } catch(e) {
    console.log(e.message);
    return res.status(500).send('Ocorreu um erro ao processar a solicitação.\nTente novamente mais tarde!')
  }
});

app.listen(5000, () => console.log('Server is running on http://localhost:5000/'));