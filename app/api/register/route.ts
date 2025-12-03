import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const client = await clientPromise;
        const db = client.db();

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

        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email already exists' },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.collection('users').insertOne({
            name,
            email,
            password: hashedPassword,
            verified: false,
            createdAt: new Date(),
        });

        return NextResponse.json(
            {
                message: 'User registered successfully',
                user: {
                    id: result.insertedId,
                    name,
                    email,
                    verified: false,
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
