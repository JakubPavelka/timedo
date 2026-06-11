import { Request, Response } from "express";
import { prisma } from "../db/db.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

const register = async (req: Request, res: Response) => {
  const { email, password, firstName } = req.body;

  if (!email || !password || !firstName) {
    return res.status(400).json({ message: "Provide all information" });
  }

  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  const bcryptSalt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, bcryptSalt);

  const createUser = await prisma.user.create({
    data: {
      email,
      firstName,
      passwordHashed: hashedPassword,
    },
  });

  return res.status(201).json({
    status: "success",
    data: {
      createUser: {
        id: createUser.id,
        email: createUser.email,
        firstName: createUser.firstName,
      },
    },
  });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Provide all information" });
  }

  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.passwordHashed);

  if (!isPasswordMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Generate JWT
  const token = generateToken(user.id, res);

  return res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
      },
      token,
    },
  });
};

const logout = async (req: Request, res: Response) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

export { register, login, logout };
