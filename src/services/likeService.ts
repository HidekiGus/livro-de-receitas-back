import * as likeRepository from '../repositories/likeRepository';
import { resolveJWT } from '../utils/jwtResolver';

export async function likeRecipe(
  authorization: string | undefined,
  recipeId: string | number
) {
  const userId = await resolveJWT(authorization);
  return await likeRepository.likeRecipe(userId, recipeId);
}

export async function getLikes(authorization?: string) {
  const userId = await resolveJWT(authorization);
  return await likeRepository.getLikedPosts(userId);
}
