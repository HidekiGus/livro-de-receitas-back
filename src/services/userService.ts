import * as userRepository from "../repositories/userRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function createUser(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) {
  if (password !== confirmPassword) {
    throw { type: "badRequest", message: "Senhas não conferem!" };
  }
  const userData = await userRepository.findUserByEmail(email);
  if (userData !== null) {
    throw { type: "alreadyUsed", message: "Esse email já está em uso!" };
  }
  const encryptedPassword = bcrypt.hashSync(password, 10);
  await userRepository.createUser(name, email, encryptedPassword);
}

export async function login(email: string, password: string) {
  const userData = await userRepository.findUserByEmail(email);
  if (userData === null) {
    throw {
      type: "notFound",
      message: "Check email and password and try again!",
    };
  } else if (bcrypt.compareSync(password, userData.password)) {
    return await generateJWT(email);
  } else {
    throw {
      type: "unauthorized",
      message: "Check your email and password and try again!",
    };
  }
}

export async function generateJWT(email: string) {
  const { id: userId } = await userRepository.findUserByEmail(email);
  const secretKey = process.env.JWT_SECRET;
  const token = jwt.sign({ userId }, secretKey);
  return token;
}

export async function getUserIdByEmail(email: string) {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw { type: "notFound", message: "User not found" };
  }

  // Mongo documents usually have `_id`; if using another adapter it may be `id`.
  const rawId = user._id ?? user.id ?? null;
  if (!rawId) {
    throw { type: "notFound", message: "User id not found" };
  }

  // If it's an ObjectId, convert to string; otherwise return as-is.
  return rawId.toString ? rawId.toString() : String(rawId);
}
