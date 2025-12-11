import { NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/lib/users-db';
import bcrypt from 'bcryptjs';
import { signupSchema } from '@/lib/api-validators';
import { errorResponse, successResponse, HttpStatus } from '@/lib/api-response';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate input with Yup
        const validated = await signupSchema.validate(body, { abortEarly: false });
        const { name, email, password } = validated;

        // Check if user already exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return errorResponse(
                'User with this email already exists',
                HttpStatus.CONFLICT
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const newUser = await createUser({
            name,
            email,
            password: hashedPassword,
            verified: false,
        });

        // Return success response
        return successResponse(
            {
                user: {
                    name: newUser.name,
                    email: newUser.email,
                    verified: newUser.verified,
                },
            },
            'User registered successfully',
            HttpStatus.CREATED
        );
    } catch (error: any) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return errorResponse(error.message, HttpStatus.BAD_REQUEST);
        }

        console.error('Registration error:', error);
        return errorResponse(
            error.message || 'An error occurred during registration',
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}
