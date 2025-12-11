import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginInterface, LoginResponseInterface, SignupRequestInterface, SignupResponseInterface, VerifyTokenResponseInterface } from '@/app/(auth)/authSchema';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.BASE_URL}/auth`, 
  }),
  // Auth endpoints
  endpoints: (builder) => ({
    // Auth login mutation
    login: builder.mutation<LoginResponseInterface, LoginInterface>({
      query: (body) => ({
        url: 'login',
        method: 'POST',
        body,
      }),
    }),
    // Auth signup mutation
    signup: builder.mutation<SignupResponseInterface, SignupRequestInterface>({
      query: (body) => ({
        url: 'signup', 
        method: 'POST',
        body,
      }),
    }),
    // Auth verify token query
    verifyToken: builder.query<VerifyTokenResponseInterface, string>({
      query: (token) => ({
        url: 'verify-token',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useVerifyTokenQuery } = authApi;
