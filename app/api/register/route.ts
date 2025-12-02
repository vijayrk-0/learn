import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
    try {
        await connectDB();

        const body = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Please provide all required fields' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email already exists' },
                { status: 409 }
            );
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        return NextResponse.json(
            {
                message: 'User registered successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    verified: user.verified,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: error.message || 'An error occurred during registration' },
            { status: 500 }
        );
    }
}
