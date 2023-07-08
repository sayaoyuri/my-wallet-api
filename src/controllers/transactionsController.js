import { db } from "../database/database.connection.js";
import { ObjectId } from "mongodb";
import dayjs from "dayjs";

export async function createTransaction (req, res) {
  if(!res.locals.token) return res.status(401).send('Você não está logado!\nFaça login novamente!')

  try {
    const activeUser = await db.collection('sessions').findOne({ token: res.locals.token });
    if(!activeUser) return res.status(401).send('Token inválido!\nFaça login novamente!')

    delete res.locals.token;

    res.locals.userId = activeUser.userId;
    res.locals.type = res.locals.type === 'entrada' ? 'income' : 'expense';
    res.locals.amount = Number(res.locals.amount).toFixed(2);
    res.locals.date = dayjs().format('DD/MM');

    const newTransaction = await db.collection('transactions').insertOne(res.locals);
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