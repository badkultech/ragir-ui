// services/api.ts
import { ApiResponse } from '../common-types';
import { ENDPOINTS } from '@/lib/utils';
import { LoginDTO } from '../otp/types';
import { loginRequest } from './types';
import { baseAPI } from '..';

export const loginAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginDTO, loginRequest>({
      query: (body) => ({
        url: `${ENDPOINTS.LOGIN}`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<LoginDTO>) => response.data,
    }),
  }),
});

export const { useLoginMutation } = loginAPI;
