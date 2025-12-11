import { NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/lib/users-db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Please provide all required fields' },
                { status: 400 }
            );
        }

        // Validate password length
        if (password.length < 6) {
            return NextResponse.json(
                { message: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = findUserByEmail(email);
        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const newUser = createUser({
            name,
            email,
            password: hashedPassword,
            verified: false,
        });

        // Return success response
        return NextResponse.json(
            {
                message: 'User registered successfully',
                user: {
                    name: newUser.name,
                    email: newUser.email,
                    verified: newUser.verified,
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
