import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

export interface JWTPayload {
    userId: string;
    email: string;
    name: string;
}

export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET!, {
        expiresIn: '7d',
    });
}

export function verifyToken(token: string): JWTPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET!) as JWTPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}
