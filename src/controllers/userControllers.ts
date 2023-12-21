import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken";

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (
    !email ||
    !email.includes("@") ||
    !name ||
    name.trim() === "" ||
    !password ||
    password.trim() === ""
  ) {
    res.status(422).json({ message: "Invalid input." });
    return;
  }
  const exist = await User.findOne({ email });

  if (exist) {
    res.status(422).json({ message: "email already been used!" });
    return;
  }

  const user = new User({ name, email, password });

  if (user) {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } else {
    res.status(500);
    throw new Error("user not found!");
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !email.includes("@") || !password || password.trim() === "") {
    res.status(422).json({ message: "Invalid input." });
    return;
  }

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
      res.status(500).json({ message: "email or password wrong!" });
    }
  } else {
    res.status(500).json({ message: "email not exist" });
  }
});

// @desc    Get all users
// @route   Get /api/users
// @access  Admin

export const getUsersList = asyncHandler(
  async (req: Request, res: Response) => {
    const pageSize = 10;
    const page: any = req.query.page || 1;
    const query: any = req.query.query || "";

    const queryFilter =
      query && query !== "all"
        ? {
            username: {
              $regex: query,
              $options: "i",
            },
          }
        : {};

    const users = await User.find({
      ...queryFilter,
    })
      .skip(pageSize * (page - 1))
      .sort("-createdAt")
      .limit(pageSize)
      .lean();

    const countUsers = await User.countDocuments({
      ...queryFilter,
    });

    const pages = Math.ceil(countUsers / pageSize);

    if (users) {
      res.status(200).json({
        countUsers,
        users,
        page,
        pages,
      });
    } else {
      res.status(500);
      throw new Error("users not found!");
    }
  }
);

// @desc    Get single user
// @route   Get /api/users/:id
// @access  Private

export const getUserBydId = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400);
      throw new Error("user not found!");
    }
  }
);

// @desc    update user profile
// @route   Put /api/users/:id
// @access  Private

export const updatrUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      if (password) user.password = password;
      await user.save();
      res.status(200).json("user has been updated!");
    } else {
      res.status(400);
      throw new Error("user not found!");
    }
  }
);

// @desc    promote user to admin
// @route   Post /api/users/promote/:id
// @access  Admin

export const promoteAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);

    if (user) {
      user.isAdmin = true;
      await user.save();
      res.status(200).json("user has been promoted to admin");
    } else {
      res.status(400);
      throw new Error("user not found!");
    }
  }
);

// @desc    delete user
// @route   Delete /api/users/:id
// @access  Admin

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.status(200).json("user has been deleted");
  } else {
    res.status(400);
    throw new Error("user not found!");
  }
});
