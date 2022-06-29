import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const user = new User({ name, email, password });

  if (user) {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } else {
    res.status(500);
    throw new Error('user not found!');
  }
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user?._id),
      });
    } else {
      res.status(500).json({ message: 'email or password wrong!' });
    }
  } else {
    res.status(500).json({ message: 'email not exist' });
  }
});

export const getUsersList = asyncHandler(
  async (req: Request, res: Response) => {
    const users = await User.find({});

    if (users) {
      res.status(200).json(users);
    } else {
      res.status(500);
      throw new Error('users not found!');
    }
  }
);

export const getUserBydId = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400);
      throw new Error('user not found!');
    }
  }
);

export const updatrUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      if (password) user.password = password;
      await user.save();
      res.status(200).json('user has been updated!');
    } else {
      res.status(400);
      throw new Error('user not found!');
    }
  }
);

export const promoteAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);

    if (user) {
      user.isAdmin = true;
      await user.save();
      res.status(200).json('user has been promoted to admin');
    } else {
      res.status(400);
      throw new Error('user not found!');
    }
  }
);

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.status(200).json('user has been deleted');
  } else {
    res.status(400);
    throw new Error('user not found!');
  }
});
