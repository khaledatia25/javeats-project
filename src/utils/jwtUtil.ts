import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Response, NextFunction } from 'express';
import { isUserToken, RequestWithUser, UserToken } from '@/types/user.types.ts';
dotenv.config();

export const generateToken: (user: UserToken) => string = (user) => {
  const token = jwt.sign(user, process.env.SECRET, {
    expiresIn: '3d',
  });
  return token;
};

export const verifyToken: (
  role: string,
) => (req: RequestWithUser, res: Response, next: NextFunction) => void = (
  role,
) => {
  return async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { token } = req.headers;
      if (!token) {
        res.status(401).send({ error: 'unauthorized access' });
        return;
      }
      const decoded: unknown = jwt.verify(token as string, process.env.SECRET);
      if (!isUserToken(decoded)) {
        res.status(401).send({ error: 'auth failed' });
        return;
      }
      req.user = decoded;

      if (role !== decoded.role) {
        res.status(401).send({ error: 'auth failed' });
        return;
      }

      next();
    } catch (e) {
      next(e);
    }
  };
};
