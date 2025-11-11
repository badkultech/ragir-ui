import { baseAPI } from "@/lib/services";
import { ENDPOINTS } from "@/lib/utils";
import { ApiResponse } from "@/lib/services/common-types";
import { TAGS } from "@/lib/services/tags";
import {
  DayDescription,
  DayDescriptionListResponse,
  DayDescriptionResponse,
  CreateDayDescriptionRequest,
  UpdateDayDescriptionRequest,
  DeleteDayDescriptionResponse,
} from "./types";

export const dayDescriptionAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET all day descriptions
    getDayDescriptions: builder.query<
      DayDescriptionListResponse,
      { organizationId: string; tripPublicId: string; dayDetailId: string }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/day-description`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<DayDescriptionListResponse>) => response.data,
      providesTags: [TAGS.dayDescription],
    }),

    // ✅ GET single day description by ID
    getDayDescriptionById: builder.query<
      DayDescriptionResponse,
      { organizationId: string; tripPublicId: string; dayDetailId: string; itemId: string }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId, itemId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/day-description/${itemId}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<DayDescriptionResponse>) => response.data,
      providesTags: [TAGS.dayDescription],
    }),

    // ✅ CREATE day description
    createDayDescription: builder.mutation<
      DayDescription,
      {
        organizationId: string;
        tripPublicId: string;
        dayDetailId: string;
        data: CreateDayDescriptionRequest;
      }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/day-description`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ApiResponse<DayDescription>) => response.data,
      invalidatesTags: [TAGS.dayDescription],
    }),

    // ✅ UPDATE day description
    updateDayDescription: builder.mutation<
      DayDescription,
      {
        organizationId: string;
        tripPublicId: string;
        dayDetailId: string;
        itemId: string;
        data: UpdateDayDescriptionRequest;
      }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId, itemId, data }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/day-description/${itemId}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: ApiResponse<DayDescription>) => response.data,
      invalidatesTags: [TAGS.dayDescription],
    }),

    // ✅ DELETE day description
    deleteDayDescription: builder.mutation<
      DeleteDayDescriptionResponse,
      { organizationId: string; tripPublicId: string; dayDetailId: string; itemId: string }
    >({
      query: ({ organizationId, tripPublicId, dayDetailId, itemId }) => ({
        url: `${ENDPOINTS.ORGANIZER.TRIP(organizationId)}/${tripPublicId}/day-details/${dayDetailId}/day-description/${itemId}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<DeleteDayDescriptionResponse>) => response.data,
      invalidatesTags: [TAGS.dayDescription],
    }),
  }),
});

export const {
  useGetDayDescriptionsQuery,
  useLazyGetDayDescriptionsQuery,
  useGetDayDescriptionByIdQuery,
  useLazyGetDayDescriptionByIdQuery,
  useCreateDayDescriptionMutation,
  useUpdateDayDescriptionMutation,
  useDeleteDayDescriptionMutation,
} = dayDescriptionAPI;
