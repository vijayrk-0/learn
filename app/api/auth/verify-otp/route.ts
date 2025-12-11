import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/users-db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, otp } = body;

        // Validate input
        if (!email || !otp) {
            return NextResponse.json(
                { message: 'Email and OTP are required' },
                { status: 400 }
            );
        }

        // Find user
        const user = await findUserByEmail(email);

        if (!user) {
            return NextResponse.json(
                { message: 'Invalid OTP or email' },
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

        // OTP is valid
        return NextResponse.json(
            {
                message: 'OTP verified successfully',
                success: true
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Verify OTP error:', error);
        return NextResponse.json(
            { message: 'An error occurred while verifying OTP' },
            { status: 500 }
        );
    }
}
