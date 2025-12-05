import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/users-db';
import { generateToken } from '@/lib/jwt';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { message: 'Please provide email and password' },
                { status: 400 }
            );
        }

        // Check if user exists
        const user = findUserByEmail(email);
        if (!user) {
            return NextResponse.json(
                { message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = generateToken({
            userId: user._id || user.email,
            email: user.email,
            name: user.name,
        });

        // Return success response
        return NextResponse.json(
            {
                message: 'Login successful',
                token,
                user: {
                    id: user._id || user.email,
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
