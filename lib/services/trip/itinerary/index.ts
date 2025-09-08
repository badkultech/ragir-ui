import { ENDPOINTS } from "@/lib/utils";
import { baseAPI } from "../..";
import { ApiResponse } from "../../common-types";
import { ItineraryItem } from "../types";

export const tripItineraryAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    saveItinerary: builder.mutation<
      ApiResponse<ItineraryItem[]>,
      { organizationId: string; tripId: number; items: ItineraryItem[] }
    >({
      query: ({ organizationId, tripId, items }) => ({
        url: ENDPOINTS.TRIP_ITINERARY(organizationId, tripId),
        method: "POST",
        body: items,
      }),
       invalidatesTags: ["tripItinerary"]
    }),

    updateItinerary: builder.mutation<
      ApiResponse<ItineraryItem[]>,
      { organizationId: string; tripId: number; items: ItineraryItem[] }
    >({
      query: ({ organizationId, tripId, items }) => ({
        url: ENDPOINTS.TRIP_ITINERARY(organizationId, tripId),
        method: "PUT",
        body: items,
      }),
      invalidatesTags: ["tripItinerary"]
    }),

    getItinerary: builder.query<
      ApiResponse<ItineraryItem[]>,
      { organizationId: string; tripId: number }
    >({
      query: ({ organizationId, tripId }) =>
        ENDPOINTS.TRIP_ITINERARY(organizationId, tripId),
      providesTags: ["tripItinerary"]
    }),
  }),
});

export const { 
  useSaveItineraryMutation, 
  useUpdateItineraryMutation,
  useGetItineraryQuery 
} = tripItineraryAPI;
