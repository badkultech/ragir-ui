// lib/services/orgPreferences.ts
import { baseAPI } from "@/lib/services";
import { OrganizationPreferenceDTO } from "./types";

export const orgPreferenceApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getPreference: builder.query<OrganizationPreferenceDTO, string>({
      query: (organizationId) => `/org/${organizationId}/organization-preference`,
      transformResponse: (response: any) => {
        // adjust if your API wraps data
        return response?.data || response;
      },
      providesTags: ["preferences"],
    }),

    updatePreference: builder.mutation<
      OrganizationPreferenceDTO,
      { organizationId: string; data: Partial<OrganizationPreferenceDTO> }
    >({
      query: ({ organizationId, data }) => ({
        url: `/org/${organizationId}/organization-preference`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["preferences"],
    }),
  }),
});

export const {
  useGetPreferenceQuery,
  useUpdatePreferenceMutation,
} = orgPreferenceApi;
