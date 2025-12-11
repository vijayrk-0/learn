import jwt from 'jsonwebtoken';
import { env } from './env';

// Interface for JWT payload
export interface JWTPayload {
    userId: string;
    email: string;
    name: string;
}

// Function to generate JWT token
export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: '7d',
    });
}

// Function to verify JWT token
export function verifyToken(token: string): JWTPayload | null {
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}
