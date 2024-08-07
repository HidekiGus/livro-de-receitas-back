import { Request, Response } from 'express';
import * as recipeService from '../services/recipeService';

export async function createRecipe(req: Request, res: Response) {
  const { title, image, portions, time, ingredients, method, utensils, userId } = req.body;
  // const { authorization } = req.headers;

  await recipeService.createRecipe(
    title,
    image,
    ingredients,
    method,
    portions,
    time,
    utensils,
    userId
    //authorization
  ); //add authorization to the end of this list before checking
  res.sendStatus(201);
}

export async function getAllRecipes(req: Request, res: Response) {
  //const data = await recipeService.getAllRecipes(req.headers.authorization);
  const data = await recipeService.getAllRecipes();
  res.status(200).send(data);
}

export async function getRecipeById(req: Request, res: Response) {
  const { id } = req.params;
  //const { authorization } = req.headers;
  const data = await recipeService.getRecipeById(id);
  res.status(200).send(data);
}
