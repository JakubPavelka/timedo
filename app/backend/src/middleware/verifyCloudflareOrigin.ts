import { NextFunction, Request, Response } from 'express';
import { timingSafeEqual } from 'crypto';

export const verifyCloudflareOrigin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (process.env.NODE_ENV !== 'production') {
        return next();
    }

    const secret = process.env.CF_ORIGIN_SECRET;
    const provided = req.headers['x-origin-secret'];

    if (
        !secret ||
        typeof provided !== 'string' ||
        provided.length !== secret.length ||
        !timingSafeEqual(Buffer.from(provided), Buffer.from(secret))
    ) {
        return res
            .status(403)
            .json({ message: 'Forbidden', code: 'ORIGIN_NOT_VERIFIED' });
    }

    next();
};
