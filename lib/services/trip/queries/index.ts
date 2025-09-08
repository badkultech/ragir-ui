import { baseAPI } from "../..";
import { TripQueryDTO, TripQueryResponse } from "./types";
import { ENDPOINTS } from "@/lib/utils";

export const tripQueryAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getTripQuery: builder.query<
      TripQueryDTO[],
      { organizationId: string; days: number }
    >({
      query: ({ organizationId, days }) => ({
        url: ENDPOINTS.TRIP_QUERIES(organizationId),
        params: { days },
      }),
      transformResponse: (response: TripQueryResponse) => {
        return response?.data ?? [];
      },
      providesTags: ["tripQueries"],
    }),
    respondToQuery: builder.mutation<
      TripQueryDTO, // return updated query
      { organizationId: string; queryId: number; response: string }
    >({
      query: ({ organizationId, queryId, response }) => ({
        url: ENDPOINTS.RESPOND_QUERY(organizationId, queryId),
        method: "POST",
        body: { response },
      }),
      invalidatesTags: ["tripQueries"],
    }),
  }),
});

export const { useGetTripQueryQuery, useRespondToQueryMutation } = tripQueryAPI;
