import * as userRepository from '../repositories/userRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;

export async function createUser(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  username = ''
) {
  if (password !== confirmPassword) {
    throw { type: 'badRequest', message: 'Senhas não conferem!' };
  }

  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw { type: 'alreadyUsed', message: 'Esse email já está em uso!' };
  }

  const encryptedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  await userRepository.createUser(name, email, encryptedPassword, username);
}

export async function login(email: string, password: string) {
  const userData = await userRepository.findUserByEmail(email);

  if (!userData) {
    throw {
      type: 'unauthorized',
      message: 'Confira seu email e senha e tente novamente!',
    };
  }

  const isPasswordValid = await bcrypt.compare(password, userData.password);
  if (!isPasswordValid) {
    throw {
      type: 'unauthorized',
      message: 'Confira seu email e senha e tente novamente!',
    };
  }

  return generateJWT(String(userData._id));
}

export function generateJWT(userId: string) {
  const secretKey = process.env.JWT_SECRET || 'default_secret';
  return jwt.sign({ userId }, secretKey, { expiresIn: '7d' });
}

export async function getUsers() {
  return await userRepository.getUsers();
}
