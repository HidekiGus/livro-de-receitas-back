import { Request, Response } from 'express';
import * as likeService from '../services/likeService';

export async function likeRecipe(req: Request, res: Response) {
  const { authorization } = req.headers;
  const { recipeId } = req.params;
  const isLiked = await likeService.likeRecipe(authorization, recipeId);
  res.status(201).send(isLiked);
}

export async function getLikes(req: Request, res: Response) {
  const { authorization } = req.headers;
  const likedPosts = await likeService.getLikes(authorization);
  res.status(200).send(likedPosts);
}
