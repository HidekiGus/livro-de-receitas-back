import { Request, Response } from 'express';
import * as userService from '../services/userService';

export async function createUser(req: Request, res: Response) {
  const { name, email, password, confirmPassword, username } = req.body;
  await userService.createUser(
    name,
    email,
    password,
    confirmPassword,
    username
  );
  res.sendStatus(201);
}

export async function getUsers(_req: Request, res: Response) {
  const data = await userService.getUsers();
  res.status(200).send(data);
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const token = await userService.login(email, password);
  res.status(200).send(token);
}

export async function getStatusCheck(_req: Request, res: Response) {
  res.status(200).send('Welcome to the livro-de-receitas API!');
}
