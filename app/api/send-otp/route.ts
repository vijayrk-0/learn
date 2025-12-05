// app/api/send-otp/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, updateUser } from '@/lib/users-db';
import nodemailer from 'nodemailer';

// Generate 6‑digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via Nodemailer (Gmail SMTP)
async function sendOTPViaEmail(email: string, otp: string): Promise<void> {
  // Get environment variables
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;

  // Validate environment variables
  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP_USER or SMTP_PASS is not set');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SMTP_USER, // Gmail username
      pass: SMTP_PASS, // Gmail app password
    },
  });

  // Create mail options
  const mailOptions = {
    from: `"Your App Name" <${SMTP_USER}>`,
    to: email,
    subject: `Password Reset OTP`,
    text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    html: `
      <p>Your OTP is <b>${otp}</b>.</p>
      <p>It will expire in 10 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// Handle POST request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body as { email?: string };

    // Validate input
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { message: 'Please provide an email address' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Optional: basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Find user
    const user = findUserByEmail(normalizedEmail);

    // Always respond generically (do not reveal if email exists)
    if (!user) {
      return NextResponse.json(
        {
          message:
            'If your email is registered, you will receive an OTP shortly.',
          success: true,
        },
        { status: 200 }
      );
    }

    // Generate OTP
    const otp = generateOTP();

    // OTP expiry (10 minutes)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP to user document
    updateUser(normalizedEmail, {
      $set: {
        resetOTP: otp,
        resetOTPExpires: otpExpiry
      }
    });

    // Send OTP via email
    await sendOTPViaEmail(normalizedEmail, otp);

    // Return success response
    return NextResponse.json(
      {
        message:
          'If your email is registered, you will receive an OTP shortly.',
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { message: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
