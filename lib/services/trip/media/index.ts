// lib/services/trip/media/index.ts
import { ENDPOINTS } from "@/lib/utils";
import { baseAPI } from "../..";
import { ApiResponse } from "../../common-types";
import { TripImageUploadDTO, TripImageResponseDTO, TripMediaResponseDTO } from "../types";

export const tripMediaAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    uploadTripImage: builder.mutation<
      ApiResponse<TripImageResponseDTO>,
      { organizationId: string; tripId: number; formData: FormData }
    >({
      query: ({ organizationId, tripId, formData }) => ({
        url: `${ENDPOINTS.TRIP_DETAILS(organizationId, tripId)}/media/upload`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { tripId }) => [
        { type: "trips", id: tripId },
        "trips"
      ],
    }),

    getTripMedia: builder.query<
      ApiResponse<TripMediaResponseDTO>,
      { organizationId: string; tripId: number }
    >({
      query: ({ organizationId, tripId }) =>
        `${ENDPOINTS.TRIP_DETAILS(organizationId, tripId)}/media`,
      providesTags: (result, error, { tripId }) => [
        { type: "trips", id: tripId }
      ],
    }),

    deleteTripImage: builder.mutation<
      ApiResponse<void>,
      { organizationId: string; tripId: number; imageId: number }
    >({
      query: ({ organizationId, tripId, imageId }) => ({
        url: `${ENDPOINTS.TRIP_DETAILS(organizationId, tripId)}/media/${imageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { tripId }) => [
        { type: "trips", id: tripId },
        "trips"
      ],
    }),

    reorderTripImages: builder.mutation<
      ApiResponse<TripImageResponseDTO[]>,
      { 
        organizationId: string; 
        tripId: number; 
        images: { id: number; sortOrder: number }[] 
      }
    >({
      query: ({ organizationId, tripId, images }) => ({
        url: `${ENDPOINTS.TRIP_DETAILS(organizationId, tripId)}/media/reorder`,
        method: "PUT",
        body: { images },
      }),
      invalidatesTags: (result, error, { tripId }) => [
        { type: "trips", id: tripId },
        "trips"
      ],
    }),
  }),
});

export const { 
  useUploadTripImageMutation,
  useGetTripMediaQuery,
  useDeleteTripImageMutation,
  useReorderTripImagesMutation,
} = tripMediaAPI;
