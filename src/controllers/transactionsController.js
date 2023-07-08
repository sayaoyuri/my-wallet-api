import { db } from "../database/database.connection.js";
import Joi from "joi";
import { stripHtml } from "string-strip-html";
import { ObjectId } from "mongodb";
import dayjs from "dayjs";

export async function createTransaction (req, res) {
  const schema = Joi.object({
    type: Joi.string().allow('entrada', 'saida').only().required(),
    token: Joi.string().min(36).max(36).required(),
    description: Joi.string().min(4).required(),
    amount: Joi.number().min(0.01).required()
  });

  if(!req.headers.token) return res.status(401).send('Você não está logado!\nFaça login novamente!')

  const requestData = {};
  try {
    requestData.token = stripHtml(req.headers.token).result.trim();
    requestData.type = stripHtml(req.params.tipo).result.trim();
    requestData.description = stripHtml(req.body.description).result.trim();
    requestData.amount = req.body.amount;
  } catch (e) {
    console.log(e.message);
    return res.status(422).send('Todos os campos são obrigatórios!');
  }

  const { error } = schema.validate( requestData, { abortEarly: false } );
  if(error) return res.status(422).send(error.details.map(e => e.message));

  try {
    const activeUser = await db.collection('sessions').findOne({ token: requestData.token });
    if(!activeUser) return res.status(401).send('Token inválido!\nFaça login novamente!')

    delete requestData.token;

    requestData.userId = activeUser.userId;
    requestData.type = requestData.type === 'entrada' ? 'income' : 'expense';
    requestData.amount = Number(requestData.amount).toFixed(2);
    requestData.date = dayjs().format('DD/MM');

    const newTransaction = await db.collection('transactions').insertOne(requestData);
    console.log(newTransaction);
    if(newTransaction.acknowledged) res.sendStatus(201);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

export async function getAllTransactions (req, res) {
  const { token } = req.headers;
  if(!token) return res.sendStatus(401);

  try {
    const user = await db.collection('sessions').findOne({ token: token });
    if(!user) return res.sendStatus(401);

    const transactions = await db.collection('transactions').find({ userId: new ObjectId(user.userId) }).sort({ _id: -1 }).toArray();
    return res.send(transactions);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};