// lib/services/trip/exclusions/index.ts
import { ENDPOINTS } from "@/lib/utils";
import { baseAPI } from "../..";
import { ApiResponse } from "../../common-types";
import { Exclusion, ExclusionsResponse, TripExclusionDTO, TripExclusionsResponseDTO } from "../types";



export const tripExclusionsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    saveTripExclusions: builder.mutation<
      ApiResponse<TripExclusionsResponseDTO[]>,
      { organizationId: string; tripId: number; exclusions: TripExclusionDTO[] }
    >({
      query: ({ organizationId, tripId, exclusions }) => ({
        url: `${ENDPOINTS.TRIP_DETAILS(organizationId, tripId)}/exclusions`,
        method: "POST",
        body: { exclusions },
      }),
      invalidatesTags: (result, error, { tripId }) => [
        { type: "trips", id: tripId },
        "trips",
      ],
    }),

    updateTripExclusions: builder.mutation<
      ApiResponse<TripExclusionsResponseDTO[]>,
      { organizationId: string; tripId: number; exclusions: TripExclusionDTO[] }
    >({
      query: ({ organizationId, tripId, exclusions }) => ({
        url: `${ENDPOINTS.TRIP_DETAILS(organizationId, tripId)}/exclusions`,
        method: "PUT",
        body: { exclusions },
      }),
      invalidatesTags: (result, error, { tripId }) => [
        { type: "trips", id: tripId },
        "trips",
      ],
    }),

    getExclusions: builder.query<Exclusion[], void>({
      query: () => ENDPOINTS.EXCLUSIONS, // "/api/master/exclusions"
      transformResponse: (response: ExclusionsResponse) => {
        return response?.data ?? [];
      },
      providesTags: ["exclusions"],
    }),

    getTripExclusions: builder.query<
      ApiResponse<TripExclusionsResponseDTO[]>,
      { organizationId: string; tripId: number }
    >({
      query: ({ organizationId, tripId }) =>
        `${ENDPOINTS.TRIP_DETAILS(organizationId, tripId)}/exclusions`,
      providesTags: (result, error, { tripId }) => [
        { type: "trips", id: tripId },
      ],
    }),
  }),
});

export const {
  useSaveTripExclusionsMutation,
  useUpdateTripExclusionsMutation,
  useGetTripExclusionsQuery,
  useGetExclusionsQuery
} = tripExclusionsAPI;
