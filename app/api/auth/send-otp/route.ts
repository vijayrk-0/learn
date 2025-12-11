// app/api/send-otp/route.ts

import { NextRequest } from 'next/server';
import { findUserByEmail, updateUser } from '@/lib/users-db';
import nodemailer from 'nodemailer';
import { sendOtpSchema } from '@/lib/api-validators';
import { errorResponse, successResponse, HttpStatus } from '@/lib/api-response';

// Generate 6‑digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via Nodemailer (Gmail SMTP)
async function sendOTPViaEmail(email: string, otp: string): Promise<void> {
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;

  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP credentials not configured');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Your App Name" <${SMTP_USER}>`,
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    html: `
      <p>Your OTP is <b>${otp}</b>.</p>
      <p>It will expire in 10 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Yup
    const validated = await sendOtpSchema.validate(body, { abortEarly: false });
    const { email } = validated;

    const user = await findUserByEmail(email);

    // Generic response for security
    if (!user) {
      return successResponse(
        undefined,
        'If your email is registered, you will receive an OTP shortly.'
      );
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await updateUser(email, {
      $set: {
        resetOTP: otp,
        resetOTPExpires: otpExpiry
      }
    });

    await sendOTPViaEmail(email, otp);

    return successResponse(
      undefined,
      'If your email is registered, you will receive an OTP shortly.'
    );
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return errorResponse(error.message, HttpStatus.BAD_REQUEST);
    }

    console.error('Send OTP error:', error);
    return errorResponse(
      'An error occurred while processing your request',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
