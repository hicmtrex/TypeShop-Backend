import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
  return jwt.sign({ id }, '3033', {
    expiresIn: '30d',
  });
};

export default generateToken;
