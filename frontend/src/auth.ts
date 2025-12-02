// @ts-ignore
import { Request, Response, NextFunction } from 'express';
// @ts-ignore
import jwt from 'jsonwebtoken';
import { UserRole } from './types';
// @ts-ignore
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface JwtPayload {
    id: number;
    email: string;
    role: UserRole;
}

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

const authenticateToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    // @ts-ignore
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'Kein Token bereitgestellt' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Ungültiger Token' });
    }
};
export default authenticateToken

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ error: 'Nicht authentifiziert' });
            return;
        }
        // @ts-ignore
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                error: 'Keine Berechtigung für diese Aktion',
                required: allowedRoles,
                current: req.user.role
            });
            return;
        }

        next();
    };
};