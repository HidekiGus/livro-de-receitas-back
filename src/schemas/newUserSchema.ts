import Joi from 'joi';

export const newUserSchema = Joi.object({
  name: Joi.string().required(),
  username: Joi.string().allow('').optional(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});
