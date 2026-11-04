import { Request, Response } from 'express';
import * as recipeService from '../services/recipeService';

export async function createRecipe(req: Request, res: Response) {
  const {
    title,
    image,
    portions,
    time,
    ingredients,
    method,
    utensils,
    userId,
  } = req.body;
  const { authorization } = req.headers;
  const authenticatedUserId = res.locals.userId || userId;

  await recipeService.createRecipe(
    title,
    image,
    ingredients,
    method,
    portions,
    time,
    utensils,
    authenticatedUserId,
    authorization
  );
  res.sendStatus(201);
}

export async function getAllRecipes(req: Request, res: Response) {
  const data = await recipeService.getAllRecipes(req.headers.authorization);
  res.status(200).send(data);
}

export async function getRecipeById(req: Request, res: Response) {
  const { id } = req.params;
  const { authorization } = req.headers;
  const data = await recipeService.getRecipeById(id, authorization);
  res.status(200).send(data);
}
