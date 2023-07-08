import { stripHtml } from "string-strip-html";

export async function stripSignUp(req, res, next ) {
  try {
    res.locals.name = stripHtml(req.body.name).result.trim();
    res.locals.email = stripHtml(req.body.email).result.trim();
    res.locals.password = stripHtml(req.body.password).result.trim();
  } catch(e) {
    return res.status(422).send('Todos os campos são obrigatórios!');
  };

  next();
};

export async function stripSignIn (req, res, next) {
  try {
    res.locals.email = stripHtml(req.body.email).result.trim();
    res.locals.password = stripHtml(req.body.password).result.trim();
  } catch (e) {
    return res.status(422).send('Todos os campos são obrigatórios!');
  };

  next();
}

export async function stripNewTransaction (req, res, next) {
  try {
    res.locals.token = stripHtml(req.headers.token).result.trim();
    res.locals.type = stripHtml(req.params.tipo).result.trim();
    res.locals.description = stripHtml(req.body.description).result.trim();
    res.locals.amount = req.body.amount;
  } catch (e) {
    console.log(e.message);
    return res.status(422).send('Todos os campos são obrigatórios!');
  };

  next();
}