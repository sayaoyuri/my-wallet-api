import { Router } from "express";
import { signIn, signUp } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post('/cadastro', signUp);
authRouter.post('/login', signIn);

export default authRouter;