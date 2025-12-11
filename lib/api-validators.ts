import * as yup from 'yup';

/**
 * Email validation schema
 */
export const emailSchema = yup.string()
    .required('Email is required')
    .email('Please provide a valid email address')
    .trim()
    .lowercase();

/**
 * Password validation schema
 */
export const passwordSchema = yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters');

/**
 * OTP validation schema
 */
export const otpSchema = yup.string()
    .required('OTP is required')
    .length(6, 'OTP must be 6 digits')
    .matches(/^\d{6}$/, 'OTP must contain only digits');

/**
 * Login validation schema
 */
export const loginSchema = yup.object({
    email: emailSchema,
    password: passwordSchema,
});

/**
 * Signup validation schema
 */
export const signupSchema = yup.object({
    name: yup.string().required('Name is required').trim(),
    email: emailSchema,
    password: passwordSchema,
});

/**
 * Send OTP validation schema
 */
export const sendOtpSchema = yup.object({
    email: emailSchema,
});

/**
 * Verify OTP validation schema
 */
export const verifyOtpSchema = yup.object({
    email: emailSchema,
    otp: otpSchema,
});

/**
 * Reset password validation schema
 */
export const resetPasswordSchema = yup.object({
    email: emailSchema,
    otp: otpSchema,
    newPassword: passwordSchema,
});

/**
 * Validate request body against schema
 * @throws ValidationError if validation fails
 */
export async function validateRequest<T>(
    schema: yup.Schema<T>,
    data: unknown
): Promise<T> {
    try {
        return await schema.validate(data, { abortEarly: false });
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            const message = error.errors.join(', ');
            throw new Error(message);
        }
        throw error;
    }
}
