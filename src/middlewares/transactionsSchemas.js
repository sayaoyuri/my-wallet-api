import Joi from "joi";

export const newTransactionSchema = Joi.object({
  type: Joi.string().allow('entrada', 'saida').only().required(),
  token: Joi.string().min(36).max(36).required(),
  description: Joi.string().min(4).required(),
  amount: Joi.number().min(0.01).required()
});