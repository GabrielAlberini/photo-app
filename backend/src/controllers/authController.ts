import { Request, Response } from 'express';
import { IUser, User } from '../models/User';
import { generateToken } from '../utils/generateToken';

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: 'Email ya registrado' });
  }
  const user = await User.create({ name, email, password });
  const token = generateToken(user.id);
  res.status(201).json({ token, user: { id: user.id, name, email, avatar: user.avatar } });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }
  const token = generateToken(user.id);
  res.json({ token, user: { id: user.id, name: user.name, email, avatar: user.avatar } });
};

export const me = async (req: Request, res: Response) => {
  const { id, name, email, avatar } = req.user!;
  res.json({ id, name, email, avatar });
};
