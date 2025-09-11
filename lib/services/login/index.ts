// services/api.ts
import { baseAPI, publicBaseAPI } from '..';
import { ApiResponse } from '../common-types';
import { ENDPOINTS } from '@/lib/utils';
import { LoginDTO } from '../otp/types';

export interface loginRequest {
  email: string;
  password: string;
}

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
