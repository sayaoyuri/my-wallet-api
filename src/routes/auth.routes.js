import { Router } from "express";
import { signIn, signUp } from "../controllers/authController.js";
import { stripSignIn, stripSignUp } from "../middlewares/stripHtml.js";
import { signInSchema, signUpSchema } from "../middlewares/authSchemas.js";
import validateSchema from "../middlewares/validateSchemas.js";
const authRouter = Router();

authRouter.post('/cadastro', stripSignUp, validateSchema(signUpSchema), signUp);
authRouter.post('/login', stripSignIn, validateSchema(signInSchema), signIn);

export default authRouter;