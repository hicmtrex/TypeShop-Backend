import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { NextFunction, Response } from 'express';
import User from '../models/userModel';
import {
  DataStoredInToken,
  RequestWithUser,
} from '../utils/interfaces/user.interface';
import sanitizedConfig from '../config';

export const auth = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    let token;

    if (authorization && authorization.startsWith('Bearer')) {
      try {
        token = authorization.split(' ')[1];

        const decoded = jwt.verify(
          token,
          sanitizedConfig.JWT_SECRET
        ) as DataStoredInToken;
        req.user = await User.findById(decoded.id).select('-password');

        next();
      } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error('Not authorized, token failed');
      }
    }
    if (!token) {
      res.status(401);
      throw new Error('Not authorized, no token');
    }
  }
);

export const admin = asyncHandler(
  async (req: RequestWithUser | any, res: Response, next: NextFunction) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(401);
      throw new Error('Not authorized, no admin');
    }
  }
);
