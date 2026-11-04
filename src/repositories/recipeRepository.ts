import { connectToDatabase, Like, Recipe } from '../database/database';

export async function createRecipe(
  title: string,
  image: string,
  ingredientList: string[],
  methodList: string[],
  portions: number,
  time: number,
  utensils: string[] = [],
  userId: string
) {
  await connectToDatabase();

  const existingRecipe = await findRecipeByUserIdAndTitle(userId, title);
  if (existingRecipe) {
    throw {
      type: 'alreadyExists',
      message:
        'Já existe uma receita com esse título criada por este usuário. Altere o título e tente novamente!',
    };
  }

  const newRecipe = new Recipe({
    title,
    image,
    ingredients: ingredientList,
    method: methodList,
    portions,
    time,
    utensils,
    userId,
  });

  await newRecipe.save();
  return String(newRecipe._id);
}

export async function get20MostRecentRecipes() {
  await connectToDatabase();
  return await Recipe.find().sort({ createdAt: -1 }).limit(20);
}

export async function findRecipeByUserIdAndTitle(
  userId: string,
  title: string
) {
  await connectToDatabase();
  return await Recipe.findOne({ userId, title });
}

export async function getAllRecipes() {
  await connectToDatabase();
  return await Recipe.find().sort({ createdAt: -1 });
}

export async function getRecipeById(id: string) {
  await connectToDatabase();
  return await Recipe.findById(id);
}

export async function getLikesByUserId(userId: string, recipeId: string) {
  await connectToDatabase();
  return await Like.find({ userId: String(userId), recipeId: String(recipeId) });
}
