import { connectToDatabase, User } from '../database/database';

export async function createUser(
  name: string,
  email: string,
  password: string,
  username = ''
) {
  await connectToDatabase();

  const newUser = new User({ name, username, email, password });
  await newUser.save();

  return String(newUser._id);
}

export async function getUsers() {
  await connectToDatabase();
  return await User.find({}, { password: 0 });
}

export async function findUserByEmail(email: string) {
  await connectToDatabase();
  return await User.findOne({ email });
}
