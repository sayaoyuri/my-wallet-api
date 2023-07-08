import { Router } from "express";
import { createTransaction, getAllTransactions } from '../controllers/transactionsController.js'

const transactionsRouter = Router();

transactionsRouter.post('/nova-transacao/:tipo', createTransaction);
transactionsRouter.get('/transactions', getAllTransactions);

export default transactionsRouter;