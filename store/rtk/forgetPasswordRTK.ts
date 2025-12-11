// src/redux/services/passwordApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Forget Password interface
interface SendOtpRequest {
  email: string;
}
// Forget Password interface
interface SendOtpResponse {
  message: string;
}

// Forget Password interface
interface VerifyOtpRequest {
  email: string;
  otp: string;
}

// Forget Password interface
interface VerifyOtpResponse {
  message: string;
}

// Forget Password interface
interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

// Forget Password interface
interface ResetPasswordResponse {
  message: string;
}

// Forget Password API
export const forgetPasswordApi = createApi({
  reducerPath: 'forgetPasswordApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `api/auth`,
  }),
  endpoints: (builder) => ({
    // Forget Password endpoints sendOtp
    sendOtp: builder.mutation<SendOtpResponse, SendOtpRequest>({
      query: (body) => ({
        url: 'send-otp',
        method: 'POST',
        body,
      }),
    }),
    // Forget Password endpoints verifyOtp
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (body) => ({
        url: 'verify-otp',
        method: 'POST',
        body,
      }),
    }),
    // Forget Password endpoints resetPassword
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: 'reset-password',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} = forgetPasswordApi;
