import { Router } from "express";
import { createTransaction, getAllTransactions } from '../controllers/transactionsController.js'
import validateSchema from "../middlewares/validateSchemas.js";
import { newTransactionSchema } from "../middlewares/transactionsSchemas.js";
import { stripNewTransaction } from "../middlewares/stripHtml.js";

const transactionsRouter = Router();

transactionsRouter.post('/nova-transacao/:tipo', stripNewTransaction, validateSchema(newTransactionSchema), createTransaction);
transactionsRouter.get('/transactions', getAllTransactions);

export default transactionsRouter;