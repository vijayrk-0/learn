import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/users-db';
import { generateToken } from '@/lib/jwt';
import bcrypt from 'bcryptjs';
import { loginSchema } from '@/lib/api-validators';
import { errorResponse, successResponse, HttpStatus } from '@/lib/api-response';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate input with Yup
        const validated = await loginSchema.validate(body, { abortEarly: false });
        const { email, password } = validated;

        // Check if user exists
        const user = await findUserByEmail(email);
        if (!user) {
            return errorResponse('Invalid email or password', HttpStatus.UNAUTHORIZED);
        }

        // Ensure user has a password
        if (!user.password) {
            return errorResponse('Invalid email or password', HttpStatus.UNAUTHORIZED);
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return errorResponse('Invalid email or password', HttpStatus.UNAUTHORIZED);
        }

        // Generate JWT token
        const token = generateToken({
            userId: user._id || user.email || '',
            email: user.email || '',
            name: user.name || '',
        });

        // Return success response
        return successResponse(
            {
                token,
                user: {
                    id: user._id || user.email,
                    name: user.name,
                    email: user.email,
                    verified: user.verified,
                },
            },
            'Login successful',
            HttpStatus.OK
        );
    } catch (error: any) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return errorResponse(error.message, HttpStatus.BAD_REQUEST);
        }

        console.error('Login error:', error);
        return errorResponse(
            'An error occurred during login',
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}
