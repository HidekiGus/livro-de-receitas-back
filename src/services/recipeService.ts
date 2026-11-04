import mongoose from 'mongoose';
import * as recipeRepository from '../repositories/recipeRepository';
import { resolveJWT, resolveOptionalJWT } from '../utils/jwtResolver';

function parseLines(input: string | string[]): string[] {
  if (Array.isArray(input)) {
    return input.map((item) => String(item).trim()).filter(Boolean);
  }
  return String(input)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function createRecipe(
  title: string,
  image: string,
  ingredients: string | string[],
  method: string | string[],
  portions: number,
  time: number,
  utensils: string[] = [],
  userId?: string,
  authorization?: string
) {
  const resolvedUserId =
    userId || (await resolveJWT(authorization));

  const ingredientList = parseLines(ingredients);
  const methodList = parseLines(method);

  const newRecipeId = await recipeRepository.createRecipe(
    title,
    image,
    ingredientList,
    methodList,
    Number(portions),
    Number(time),
    utensils || [],
    resolvedUserId
  );

  return newRecipeId;
}

export async function getAllRecipes(authorization?: string) {
  const userId = await resolveOptionalJWT(authorization);
  const recipes = await recipeRepository.get20MostRecentRecipes();

  const enrichedRecipes = [];
  for (const recipe of recipes) {
    const recipeObj: any =
      typeof recipe.toJSON === 'function' ? recipe.toJSON() : recipe;
    const recipeId = String(recipeObj._id || recipeObj.id);

    if (userId) {
      const likesData = await recipeRepository.getLikesByUserId(userId, recipeId);
      enrichedRecipes.push({ ...recipeObj, isLiked: likesData.length > 0 });
    } else {
      enrichedRecipes.push({ ...recipeObj, isLiked: false });
    }
  }

  return enrichedRecipes;
}

export async function getRecipeById(id: string, authorization?: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw {
      type: 'badRequest',
      message: 'ID da receita inválido!',
    };
  }

  const recipe = await recipeRepository.getRecipeById(id);
  if (!recipe) {
    throw {
      type: 'notFound',
      message: 'Receita não encontrada!',
    };
  }

  const recipeObj = typeof recipe.toJSON === 'function' ? recipe.toJSON() : recipe;
  const userId = await resolveOptionalJWT(authorization);

  if (!userId) {
    return { ...recipeObj, isLiked: false };
  }

  const likesData = await recipeRepository.getLikesByUserId(userId, id);
  return { ...recipeObj, isLiked: likesData.length > 0 };
}
