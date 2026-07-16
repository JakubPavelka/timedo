import { prisma } from '../db/db.js';
import { Request, Response } from 'express';

const deleteUser = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            await prisma.refreshToken.deleteMany({
                where: { token: refreshToken },
            });
        }

        await prisma.user.delete({ where: { id: req.user?.id } });

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
        };

        res.clearCookie('accessToken', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);

        return res.status(200).json({ message: 'User deleted' });
    } catch {
        return res.status(500).json({ message: 'Failed to delete user' });
    }
};

export { deleteUser };
