import { Router } from "express";
import authRouter from "./auth.routes.js";
import transactionsRouter from "./transactions.routes.js";

const router = Router();
router.use(authRouter);
router.use(transactionsRouter);

export default router;
