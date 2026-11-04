import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export async function resolveJWT(authorization?: string): Promise<string> {
  if (!authorization) {
    throw {
      type: 'unauthorized',
      message: 'Token de autenticação não fornecido!',
    };
  }

  const token = authorization.replace(/^Bearer\s+/i, '').trim();

  if (!token || token === 'null' || token === 'undefined') {
    throw {
      type: 'unauthorized',
      message: 'Token de autenticação inválido!',
    };
  }

  try {
    const secretKey = process.env.JWT_SECRET || 'default_secret';
    const decoded = jwt.verify(token, secretKey) as TokenPayload;
    return String(decoded.userId);
  } catch (_error) {
    throw {
      type: 'unauthorized',
      message: 'Token de autenticação inválido ou expirado!',
    };
  }
}

export async function resolveOptionalJWT(
  authorization?: string
): Promise<string | null> {
  if (!authorization) {
    return null;
  }

  const token = authorization.replace(/^Bearer\s+/i, '').trim();
  if (!token || token === 'null' || token === 'undefined') {
    return null;
  }

  try {
    return await resolveJWT(token);
  } catch (_error) {
    return null;
  }
}
