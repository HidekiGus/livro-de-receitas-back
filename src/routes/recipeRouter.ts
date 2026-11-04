import { Router } from 'express';
import * as recipeController from '../controllers/recipeController';
import { validateSchema } from '../middlewares/validateSchema';
import { newRecipeSchema } from '../schemas/newRecipeSchema';

const recipeRouter = Router();

recipeRouter.post(
  '/recipes',
  validateSchema(newRecipeSchema),
  recipeController.createRecipe
);
recipeRouter.get('/recipes', recipeController.getAllRecipes);
recipeRouter.get('/recipes/:id', recipeController.getRecipeById);

export default recipeRouter;
