// services/api.ts
import { baseAPI, publicBaseAPI } from '..';
import { ApiResponse } from '../common-types';
import { ENDPOINTS } from '@/lib/utils';
import { LoginDTO } from '../otp/types';

export interface SetupPasswordRequest {
  token: string;
  password: string;
}

export const adminAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    setupPassword: builder.mutation<LoginDTO, SetupPasswordRequest>({
      query: (body) => ({
        url: `${ENDPOINTS.SETUP_PASSWORD}`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<LoginDTO>) => response.data,
    }),
  }),
});

export const { useSetupPasswordMutation } = adminAPI;
