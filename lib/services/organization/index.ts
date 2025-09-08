import {
  CreateOrganizationRequest,
  type ActionOrganizationResponse,
  type GetByIdRequest,
  type GetOrganizationAPIResponse,
} from '@/lib/services/organization/types';

import { baseAPI } from '..';
import { ENDPOINTS } from '@/lib/utils';

export const getOrganizationsAPI = baseAPI.injectEndpoints({
  endpoints: (b) => ({
    getOrganizations: b.query<GetOrganizationAPIResponse, GetByIdRequest>({
      query: ({ id }) => ({
        url: `${ENDPOINTS.ORGANIZATION}`,
      }),
    }),
    getOrganizationById: b.query<GetOrganizationAPIResponse, GetByIdRequest>({
      query: ({ id }) => ({
        url: `${ENDPOINTS.ORGANIZATION}/${id}`,
      }),
    }),

    createOrganization: b.mutation<
      ActionOrganizationResponse,
      CreateOrganizationRequest
    >({
      query: (payload) => {
        return {
          url: `${ENDPOINTS.ONBOARDING}/${payload.id}`,
          method: 'POST',
          body: payload,
        };
      },
    }),

    deleteOrganization: b.mutation<ActionOrganizationResponse, GetByIdRequest>({
      query: (payload) => {
        return {
          url: `${ENDPOINTS.ORGANIZATION}/${payload.id}`,
          method: 'DELETE',
        };
      },
    }),
  }),
});

export const {
  useGetOrganizationsQuery,
  useGetOrganizationByIdQuery,
  useCreateOrganizationMutation,
  useDeleteOrganizationMutation,
} = getOrganizationsAPI;
