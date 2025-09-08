


import { ENDPOINTS } from '@/lib/utils';
import { baseAPI } from '../..';
import { CreateOrganizationRequest } from './types';

export const getOrganizationsAPI = baseAPI.injectEndpoints({
  endpoints: (b) => ({
    createOrganization: b.mutation<
      unknown,
      CreateOrganizationRequest
    >({
      query: (payload) => {
        return {
          url: `${ENDPOINTS.ONBOARDING}`,
          method: 'POST',
          body: payload,
        };
      },
    }),
  }),
});

export const {
  useCreateOrganizationMutation,
} = getOrganizationsAPI;