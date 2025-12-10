import * as yup from 'yup';

// Common messages
const MSG_REQUIRED = 'This field is required';
const MSG_MIN_6 = 'Must be at least 6 characters';
const MSG_EMAIL_INVALID = 'Invalid email address format';
const MSG_PASSWORDS_MUST_MATCH = 'Passwords must match';

// Reusable field schemas
export const emailField = yup
  .string()
  .required(MSG_REQUIRED)
  .min(6, MSG_MIN_6)
  .max(100, 'Must be at most 100 characters')
  .email(MSG_EMAIL_INVALID);

export const passwordField = yup
  .string()
  .required(MSG_REQUIRED)
  .min(6, MSG_MIN_6);

export const nameField = yup
  .string()
  .required(MSG_REQUIRED)
  .min(3, 'Must be at least 3 characters');

export const otpField = yup
  .string()
  .required(MSG_REQUIRED)
  .length(6, 'Must be exactly 6 characters');

// Schemas
export const loginSchema = yup.object({
  email: emailField,
  password: passwordField,
});

export const signupSchema = yup.object({
  name: nameField,
  email: emailField,
  password: passwordField,
  confirmPassword: passwordField.oneOf(
    [yup.ref('password')],
    MSG_PASSWORDS_MUST_MATCH
  ),
});

export const resetPasswordSchema = yup.object({
  password: passwordField,
  confirmPassword: passwordField.oneOf(
    [yup.ref('password')],
    MSG_PASSWORDS_MUST_MATCH
  ),
});

export const otpSchema = yup.object({
  otp: otpField,
});
