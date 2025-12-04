import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

// Interface for JWT payload
export interface JWTPayload {
    userId: string;
    email: string;
    name: string;
}

// Function to generate JWT token
export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET!, {
        expiresIn: '7d',
    });
}

// Function to verify JWT token
export function verifyToken(token: string): JWTPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET!) as JWTPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}
