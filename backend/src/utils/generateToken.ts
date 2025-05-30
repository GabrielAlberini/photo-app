import jwt from 'jsonwebtoken';

export function generateToken(id: string): string {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });
}
