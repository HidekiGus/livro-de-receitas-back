import { Request, Response, NextFunction } from 'express';

const ERROR_STATUS_MAP: Record<string, number> = {
  badRequest: 400,
  unauthorized: 401,
  notFound: 404,
  alreadyUsed: 409,
  alreadyExists: 409,
  conflict: 409,
  unprocessableEntity: 422,
};

export default function errorHandler(
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = error?.type ? ERROR_STATUS_MAP[error.type] || 500 : 500;
  const message = error?.message || 'Erro interno do servidor.';

  return res.status(statusCode).send(message);
}
