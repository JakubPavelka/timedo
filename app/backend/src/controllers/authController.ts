import { Request, Response } from 'express';
import { prisma } from '../db/db.js';
import bcrypt from 'bcryptjs';
import {
    generateAccessToken,
    generateRefreshToken,
} from '../utils/generateToken.js';

const register = async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, termsAccepted } = req.body;

    if (!email || !password || !firstName || !lastName || !termsAccepted) {
        return res.status(400).json({
            message: 'Provide all information',
            code: 'MISSING_FIELDS',
        });
    }

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
};

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Provide all information',
            code: 'MISSING_FIELDS',
        });
    }

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
};

const logout = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

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

    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully',
    });
};

const refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res
            .status(401)
            .json({ message: 'Not authorized', code: 'NO_REFRESH_TOKEN' });
    }

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

    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

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
};

const me = async (req: Request, res: Response) => {
    return res.status(200).json({
        status: 'success',
        data: { user: req.user },
    });
};

const updateMe = async (req: Request, res: Response) => {
    console.log('xd');
    const { firstName, lastName } = req.body;
    console.log('FIRSTNAME', firstName, 'LASTNAME', lastName);

    if (!firstName) {
        return res.status(400).json({
            message: 'Provide all information',
            code: 'MISSING_FIELDS',
        });
    }

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
};

export { register, login, logout, refresh, me, updateMe };
