import { connectToDatabase, Like, Recipe } from '../database/database';
import { getLikesByUserId } from './recipeRepository';

export async function likeRecipe(
  userId: string | number,
  recipeId: string | number
) {
  await connectToDatabase();

  const existingLikes = await getLikesByUserId(
    String(userId),
    String(recipeId)
  );

  if (existingLikes.length > 0) {
    await Like.deleteOne({ _id: existingLikes[0]._id });
    await Recipe.findByIdAndUpdate(recipeId, { $inc: { likes: -1 } });
    return false;
  } else {
    const newLike = new Like({
      userId: String(userId),
      recipeId: String(recipeId),
    });
    await newLike.save();
    await Recipe.findByIdAndUpdate(recipeId, { $inc: { likes: 1 } });
    return true;
  }
}

export async function getLikedPosts(userId: string | number) {
  await connectToDatabase();

  const likes = await Like.find({ userId: String(userId) }).sort({
    createdAt: -1,
  });

  const recipeIds = likes.map((like) => like.recipeId);
  if (recipeIds.length === 0) {
    return [];
  }

  const recipes = await Recipe.find({ _id: { $in: recipeIds } });
  return recipes.map((recipe) => ({
    ...recipe.toJSON(),
    isLiked: true,
  }));
}
