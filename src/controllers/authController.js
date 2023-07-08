import { db } from "../database/database.connection.js";
import bcrypt from 'bcrypt';
import { v4 as uuidToken } from 'uuid';

export async function signUp (req, res) {
  try {
    const user = await db.collection('users').findOne({ email: res.locals.email })
    if(user) return res.status(409).send('E-mail já cadastrado!');

    res.locals.password = bcrypt.hashSync(res.locals.password, 10);

    const newUser = await db.collection('users').insertOne(res.locals);
    if(newUser.acknowledged) return res.status(201).send('Cadastro realizado com sucesso!');
  } catch(e) {
    console.log(e.message);
    return res.status(500).send('Ocorreu um erro ao processar a solicitação.\nTente novamente mais tarde!')
  }
};

export async function signIn (req, res) {
  try {
    const dbUser = await db.collection('users').findOne({ email: res.locals.email })
    if(!dbUser) return res.status(404).send('E-mail não cadastrado!');

    const auth = bcrypt.compareSync(res.locals.password, dbUser.password);
    if(!auth) return res.status(401).send('Senha incorreta!');

    dbUser.token = uuidToken();
    delete dbUser.password;

    const newSession = await db.collection('sessions').insertOne({ name : dbUser.name, email: dbUser.email, userId: dbUser._id, token: dbUser.token});
    if(newSession.acknowledged) return res.send({name: dbUser.name, token: dbUser.token });
  } catch (e) {
    return res.status(500).send(e.message)
  }
};