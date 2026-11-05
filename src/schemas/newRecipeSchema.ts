import Joi from 'joi';

export const newRecipeSchema = Joi.object({
  title: Joi.string().required(),
  // image: Joi.string().uri().required(),
  ingredients: Joi.alternatives()
    .try(Joi.string(), Joi.array().items(Joi.string()))
    .required(),
  method: Joi.alternatives()
    .try(Joi.string(), Joi.array().items(Joi.string()))
    .required(),
  portions: Joi.number().integer().positive().required(),
  time: Joi.number().integer().positive().required(),
  utensils: Joi.array().items(Joi.string()).optional(),
  userId: Joi.string().optional(),
});
