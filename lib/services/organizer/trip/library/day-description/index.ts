import { baseAPI } from '@/lib/services';
import { ENDPOINTS } from '@/lib/utils';
import { da } from 'date-fns/locale';
import { DayDescription, DayDescriptionByIdResponse } from './types';
import { ApiResponse } from '@/lib/services/common-types';
import { TAGS } from '@/lib/services/tags';

export const organizerAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    createOrganizerDayDescription: builder.mutation<
      DayDescriptionByIdResponse,
      { organizationId: string; data: FormData }
    >({
      query: ({ organizationId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.DAY_DESCRIPTION(organizationId)}`,
        method: 'POST',
        body: data,
        // DON'T manually set Content-Type — browser will handle it with boundary
      }),
      transformResponse: (response: ApiResponse<DayDescriptionByIdResponse>) =>
        response.data,
      invalidatesTags: [TAGS.dayDescriptions],
    }),
    getOrganizerDayDescription: builder.query<
      Array<DayDescription>,
      { organizationId: string }
    >({
      query: ({ organizationId }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.DAY_DESCRIPTION(organizationId)}`,
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<Array<DayDescription>>) =>
        response.data,
      providesTags: [TAGS.dayDescriptions],
    }),
    getOrganizerDayDescriptionById: builder.query<
      DayDescriptionByIdResponse,
      { organizationId: string; dayDescriptionId: number }
    >({
      query: ({ organizationId, dayDescriptionId }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.DAY_DESCRIPTION(
          organizationId,
        )}/${dayDescriptionId}`,
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<DayDescriptionByIdResponse>) =>
        response.data,
    }),
    updateOrganizerDayDescription: builder.mutation<
      DayDescriptionByIdResponse,
      { organizationId: string; dayDescriptionId: string; data: FormData }
    >({
      query: ({ organizationId, dayDescriptionId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.DAY_DESCRIPTION(
          organizationId,
        )}/${dayDescriptionId}`,
        method: 'PUT',
        body: data,
        // DON'T manually set Content-Type — browser will handle it with boundary
      }),
      transformResponse: (response: ApiResponse<DayDescriptionByIdResponse>) =>
        response.data,
      invalidatesTags: [TAGS.dayDescriptions],
    }),
    deleteOrganizerDayDescription: builder.mutation<
      DayDescriptionByIdResponse,
      { organizationId: string; dayDescriptionId: number }
    >({
      query: ({ organizationId, dayDescriptionId }) => ({
        url: `${ENDPOINTS.ORGANIZER.LIBRARY.DAY_DESCRIPTION(
          organizationId,
        )}/${dayDescriptionId}`,
        method: 'DELETE',
        // DON'T manually set Content-Type — browser will handle it with boundary
      }),
      transformResponse: (response: ApiResponse<DayDescriptionByIdResponse>) =>
        response.data,
      invalidatesTags: [TAGS.dayDescriptions],
    }),
  }),
});

export const {
  useUpdateOrganizerDayDescriptionMutation,
  useCreateOrganizerDayDescriptionMutation,
  useGetOrganizerDayDescriptionByIdQuery,
  useGetOrganizerDayDescriptionQuery,
  useDeleteOrganizerDayDescriptionMutation,
} = organizerAPI;
