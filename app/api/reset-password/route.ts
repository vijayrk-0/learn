import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db();

        // Parse request body
        const body = await request.json();
        const { email, otp, newPassword } = body;

        // Validate input
        if (!email || !otp || !newPassword) {
            return NextResponse.json(
                { message: 'Email, OTP, and new password are required' },
                { status: 400 }
            );
        }

        // Validate password length
        if (newPassword.length < 6) {
            return NextResponse.json(
                { message: 'Password must be at least 6 characters long' },
                { status: 400 }
            );
        }

        // Find user
        const user = await db.collection('users').findOne({ email: email.toLowerCase() });

        // Validate user
        if (!user) {
            return NextResponse.json(
                { message: 'Invalid request' },
                { status: 400 }
            );
        }

        // Check if OTP exists and hasn't expired
        if (!user.resetOTP || !user.resetOTPExpires) {
            return NextResponse.json(
                { message: 'No OTP request found. Please request a new OTP.' },
                { status: 400 }
            );
        }

        // Check if OTP is expired
        if (new Date() > user.resetOTPExpires) {
            return NextResponse.json(
                { message: 'OTP has expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Verify OTP
        if (user.resetOTP !== otp) {
            return NextResponse.json(
                { message: 'Invalid OTP' },
                { status: 400 }
            );
        }

        // Update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user document
        await db.collection('users').updateOne(
            { email: email.toLowerCase() },
            {
                $set: { password: hashedPassword },
                $unset: { resetOTP: "", resetOTPExpires: "" }
            }
        );

        // Return success response
        return NextResponse.json(
            {
                message: 'Password reset successfully',
                success: true
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { message: 'An error occurred while resetting password' },
            { status: 500 }
        );
    }
}
