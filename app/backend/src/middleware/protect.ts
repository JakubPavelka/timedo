import jwt from 'jsonwebtoken';
import { prisma } from '../db/db.js';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res
                .status(401)
                .json({ message: 'Not authorized', code: 'NO_ACCESS_TOKEN' });
        }

        if (!process.env.JWT_SECRET) {
            return res
                .status(400)
                .json({ message: 'JWT_SECRET was not found' });
        }

        let decoded: { id: string };
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET) as {
                id: string;
            };
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return res.status(401).json({
                    message: 'Access token expired',
                    code: 'TOKEN_EXPIRED',
                });
            }
            return res
                .status(401)
                .json({ message: 'Not authorized', code: 'INVALID_TOKEN' });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, firstName: true, lastName: true },
        });

        if (!user) {
            return res
                .status(401)
                .json({ message: 'Not authorized', code: 'USER_NOT_FOUND' });
        }

        req.user = user;

        next();
    } catch (error) {
        req.log.error(error);
        res.status(401).json({ message: 'Not authorized' });
    }
};
