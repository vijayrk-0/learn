import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { message: 'No token provided' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                { message: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                message: 'Token is valid',
                user: {
                    userId: decoded.userId,
                    email: decoded.email,
                    name: decoded.name,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Token verification error:', error);
        return NextResponse.json(
            { message: 'An error occurred during token verification' },
            { status: 500 }
        );
    }
}
