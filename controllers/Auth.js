import User from "../models/User.js";
import { validationResult } from "express-validator";
export const register = async (req, res, next) => {
  try {
    const userExists = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });
    if (userExists) {
      // return res.status(400).json({ message: "User already exists" });
      throw new Error("User already exists");
    }
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findUserByCredentials(username, password);
    if (!user) return res.status(401).json({ message: "Invalid Credentials" });

    res.send({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
