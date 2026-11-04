import mongoose from 'mongoose';

export async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL não está configurada no ambiente.');
  }

  await mongoose.connect(databaseUrl);
  console.log('Connected to MongoDB');
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
}

const schemaOptions = {
  toJSON: {
    virtuals: true,
    transform: (_doc: any, ret: any) => {
      ret.id = ret._id;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform: (_doc: any, ret: any) => {
      ret.id = ret._id;
      return ret;
    },
  },
};

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  schemaOptions
);

export const User = mongoose.model('User', userSchema);

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    userId: { type: String, required: true },
    image: { type: String, required: true },
    portions: { type: Number, required: true },
    time: { type: Number, required: true },
    ingredients: { type: [String], required: true },
    method: { type: [String], required: true },
    utensils: { type: [String], default: [] },
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  schemaOptions
);

export const Recipe = mongoose.model('Recipe', recipeSchema);

const likeSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    recipeId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  schemaOptions
);

export const Like = mongoose.model('Like', likeSchema);
