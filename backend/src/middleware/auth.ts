import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

interface JwtPayload { id: string; }

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token' });
  }
  try {
    const token = auth.split(' ')[1];
    const { id } = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findById(id).select('-password');
    if (!user) throw new Error();
    req.user = user as IUser;
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido' });
  }
};
