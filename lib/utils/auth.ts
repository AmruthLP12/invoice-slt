import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request) => {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) throw new Error('No token provided');

  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
