import jwt from "jsonwebtoken";
import { prisma } from "../db/db.js";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(400).json({ message: "JWT_SECRET was not found" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decode.id },
      select: { id: true, email: true, firstName: true, lastName: true },
    });

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Not authorized" });
  }
};
