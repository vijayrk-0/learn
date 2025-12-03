import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { generateToken } from '@/lib/jwt';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const client = await clientPromise;
        const db = client.db();

        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Please provide email and password' },
                { status: 400 }
            );
        }

        const user = await db.collection('users').findOne({ email });
        if (!user) {
            return NextResponse.json(
                { message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
        });

        return NextResponse.json(
            {
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    verified: user.verified,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: error.message || 'An error occurred during login' },
            { status: 500 }
        );
    }
}
