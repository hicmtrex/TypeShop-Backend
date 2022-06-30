import jwt from 'jsonwebtoken';
import sanitizedConfig from '../config';

const generateToken = (id: string) => {
  return jwt.sign({ id }, sanitizedConfig.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;
