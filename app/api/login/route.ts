import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';

export async function POST(request: Request) {
    try {
        await connectDB();

        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Please provide email and password' },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const isPasswordValid = await user.comparePassword(password);
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
