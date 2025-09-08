// lib/services/trip/basicdetails/index.ts
import { ENDPOINTS } from "@/lib/utils";
import { baseAPI } from "../..";

import { PageResponse, TripCreateRequestDTO, TripDTO } from "../types";
import { cleanMoneyValue } from "@/lib/utils/currency";

export const tripBasicAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // Create new trip
    saveBasic: builder.mutation<
      TripDTO,
      { organizationId: string; payload: TripCreateRequestDTO }
    >({
      query: ({ organizationId, payload }) => ({
        url: ENDPOINTS.TRIP(organizationId),
        method: "POST",
        body: {
          ...payload,
          // Clean all money fields
          basePrice: cleanMoneyValue(payload.basePrice),
          discountPercentage: payload.discountPercentage || 0,
        },
      }),
      invalidatesTags: ["trips"],
    }),

    // Update existing trip
    updateBasic: builder.mutation<
      TripDTO,
      { organizationId: string; id: number; payload: Partial<TripCreateRequestDTO> }
    >({
      query: ({ organizationId, id, payload }) => ({
        url: ENDPOINTS.TRIP_DETAILS(organizationId, id),
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "trips", id },
        "trips"
      ],
    }),

    // Get trip by ID
    getBasic: builder.query<
      TripDTO,
      { organizationId: string; id: number }
    >({
      query: ({ organizationId, id }) => ({
        url: ENDPOINTS.TRIP_DETAILS(organizationId, id),
      }),
      providesTags: (result, error, { id }) => [{ type: "trips", id }],
    }),

    // Get all trips with pagination
    getAllTrips: builder.query<
      PageResponse<TripDTO>,
      {
        organizationId: string;
        page?: number;
        size?: number;
        status?: string;
        sortBy?: string;
        sortDir?: string;
      }
    >({
      query: ({ organizationId, page = 0, size = 20, status, sortBy, sortDir }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          size: size.toString(),
        });
        
        if (status) params.append('status', status);
        if (sortBy) params.append('sortBy', sortBy);
        if (sortDir) params.append('sortDir', sortDir);

        return `${ENDPOINTS.TRIP(organizationId)}?${params}`;
      },
      providesTags: ["trips"],
    }),

    // Update trip status
    updateTripStatus: builder.mutation<
      TripDTO,
      { organizationId: string; id: number; status: string }
    >({
      query: ({ organizationId, id, status }) => ({
        url: ENDPOINTS.TRIP_STATUS(organizationId, id),
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "trips", id },
        "trips"
      ],
    }),

    // Delete trip
    deleteTrip: builder.mutation<
      void,
      { organizationId: string; id: number }
    >({
      query: ({ organizationId, id }) => ({
        url: ENDPOINTS.TRIP_DETAILS(organizationId, id),
        method: "DELETE",
      }),
      invalidatesTags: ["trips"],
    }),
  }),
});

export const {
  useSaveBasicMutation,
  useUpdateBasicMutation,
  useGetBasicQuery,
  useGetAllTripsQuery,
  useUpdateTripStatusMutation,
  useDeleteTripMutation,
} = tripBasicAPI;
