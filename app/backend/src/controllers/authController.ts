import { Request, Response } from 'express';
import { prisma } from '../db/db.js';
import { Prisma } from '../generated/prisma/client.js';
import bcrypt from 'bcryptjs';
import {
    RegisterPayloadSchema,
    LoginSchema,
    ChangePasswordSchema,
} from '@timedo/shared/src/schemas/authSchema';
import { ProfileSchema } from '@timedo/shared/src/schemas/profileSchema';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';

const register = async (req: Request, res: Response) => {
    const parsedBody = RegisterPayloadSchema.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).json({
            message: 'Invalid input',
            code: 'VALIDATION_ERROR',
        });
    }

    const { email, password, firstName, lastName } = parsedBody.data;

    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (user) {
            return res.status(400).json({
                message: 'User already exists',
                code: 'USER_ALREADY_EXISTS',
            });
        }

        const bcryptSalt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, bcryptSalt);

        const createUser = await prisma.user.create({
            data: {
                email,
                firstName,
                lastName,
                passwordHashed: hashedPassword,
                termsAcceptedAt: new Date(),
            },
        });

        generateAccessToken(createUser.id, res);

        const { token: refreshToken, expiresAt } = generateRefreshToken(res);

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: createUser.id,
                expiresAt,
            },
        });

        return res.status(201).json({
            status: 'success',
            data: {
                user: {
                    id: createUser.id,
                    email: createUser.email,
                    firstName: createUser.firstName,
                    lastName: createUser.lastName,
                },
            },
        });
    } catch (err) {
        req.log.error(err, 'Failed to register user');
        return res.status(500).json({ message: 'Failed to register user' });
    }
};

const login = async (req: Request, res: Response) => {
    const parsedBody = LoginSchema.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).json({
            message: 'Invalid input',
            code: 'VALIDATION_ERROR',
        });
    }

    const { email, password } = parsedBody.data;

    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password',
                code: 'INVALID_CREDENTIALS',
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.passwordHashed);

        if (!isPasswordMatch) {
            return res.status(401).json({
                message: 'Invalid email or password',
                code: 'INVALID_CREDENTIALS',
            });
        }

        generateAccessToken(user.id, res);

        const { token: refreshToken, expiresAt } = generateRefreshToken(res);

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt,
            },
        });

        return res.status(200).json({
            status: 'success',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                },
            },
        });
    } catch (err) {
        req.log.error(err, 'Failed to log in');
        return res.status(500).json({ message: 'Failed to log in' });
    }
};

const logout = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    try {
        if (refreshToken) {
            await prisma.refreshToken.deleteMany({
                where: { token: refreshToken },
            });
        }

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
        };

        res.clearCookie('accessToken', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);

        return res.status(200).json({
            status: 'success',
            message: 'Logged out successfully',
        });
    } catch (err) {
        req.log.error(err, 'Failed to log out');
        return res.status(500).json({ message: 'Failed to log out' });
    }
};

const refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res
            .status(401)
            .json({ message: 'Not authorized', code: 'NO_REFRESH_TOKEN' });
    }

    try {
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });

        if (!storedToken || storedToken.expiresAt < new Date()) {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            return res.status(401).json({
                message: 'Refresh token expired or invalid',
                code: 'REFRESH_TOKEN_INVALID',
            });
        }

        try {
            await prisma.refreshToken.delete({ where: { id: storedToken.id } });
        } catch (err) {
            if (
                err instanceof Prisma.PrismaClientKnownRequestError &&
                err.code === 'P2025'
            ) {
                res.clearCookie('accessToken');
                res.clearCookie('refreshToken');
                return res.status(401).json({
                    message: 'Refresh token expired or invalid',
                    code: 'REFRESH_TOKEN_INVALID',
                });
            }
            throw err;
        }

        const { token: newRefreshToken, expiresAt } = generateRefreshToken(res);

        await prisma.refreshToken.create({
            data: {
                token: newRefreshToken,
                userId: storedToken.userId,
                expiresAt,
            },
        });

        generateAccessToken(storedToken.userId, res);

        return res.status(200).json({ status: 'success' });
    } catch (err) {
        req.log.error(err, 'Failed to refresh token');
        return res.status(500).json({ message: 'Failed to refresh token' });
    }
};

const me = async (req: Request, res: Response) => {
    return res.status(200).json({
        status: 'success',
        data: { user: req.user },
    });
};

const updateMe = async (req: Request, res: Response) => {
    const parsedBody = ProfileSchema.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).json({
            message: 'Invalid input',
            code: 'VALIDATION_ERROR',
        });
    }

    const { firstName, lastName } = parsedBody.data;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: req.user?.id },
            data: {
                firstName,
                lastName: lastName || null,
            },
            select: { id: true, email: true, firstName: true, lastName: true },
        });

        return res.status(200).json({
            status: 'success',
            data: { user: updatedUser },
        });
    } catch (err) {
        req.log.error(err, 'Failed to update profile');
        return res.status(500).json({ message: 'Failed to update profile' });
    }
};

const changePassword = async (req: Request, res: Response) => {
    const parsedBody = ChangePasswordSchema.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).json({
            message: 'Invalid input',
            code: 'VALIDATION_ERROR',
        });
    }

    const { currentPassword, newPassword } = parsedBody.data;

    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user?.id },
        });

        if (!user) {
            return res
                .status(401)
                .json({ message: 'Not authorized', code: 'USER_NOT_FOUND' });
        }

        const isPasswordMatch = await bcrypt.compare(
            currentPassword,
            user.passwordHashed
        );

        if (!isPasswordMatch) {
            return res.status(401).json({
                message: 'Current password is incorrect',
                code: 'INCORRECT_PASSWORD',
            });
        }

        const bcryptSalt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, bcryptSalt);

        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHashed: hashedPassword },
        });

        return res.status(200).json({
            status: 'success',
            message: 'Password changed successfully',
        });
    } catch (err) {
        req.log.error(err, 'Failed to change password');
        return res.status(500).json({ message: 'Failed to change password' });
    }
};

export { register, login, logout, refresh, me, updateMe, changePassword };
