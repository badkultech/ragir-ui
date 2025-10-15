import { ENDPOINTS } from '@/lib/utils';
import { baseAPI } from '..';
import { PartnerResponse } from './types';
import { ApiResponse } from '../common-types';

export const organizerAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    organizerProfile: builder.mutation<
      PartnerResponse,
      { organizationId: string; data: FormData }
    >({
      query: ({ organizationId, data }) => ({
        url: `${ENDPOINTS.ORGANIZATION_PROFILE(organizationId)}`,
        method: 'PUT',
        body: data,
        // DON'T manually set Content-Type — browser will handle it with boundary
      }),
      transformResponse: (response: ApiResponse<PartnerResponse>) =>
        response.data,
    }),
  }),
});

export const { useOrganizerProfileMutation } = organizerAPI;
