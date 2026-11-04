import { Request, Response, NextFunction } from 'express';
import { resolveJWT } from '../utils/jwtResolver';

export async function validateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;
  const userId = await resolveJWT(authorization);
  res.locals.userId = userId;
  next();
}
