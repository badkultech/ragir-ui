import { baseAPI } from "@/lib/services";
import { ApiResponse } from "@/lib/services/common-types";
import { TripFilterRequest, TripFilterResponse } from "./types";
import { TAGS } from "@/lib/services/tags";


export const tripAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getTrips: builder.query<
      TripFilterResponse,
      { organizationId: string; filters: TripFilterRequest }
    >({
      query: ({ organizationId, filters }) => ({
        url: `/org/${organizationId}/trip-filter`,
        method: "GET",
        params: filters,
      }),
      transformResponse: (res: ApiResponse<TripFilterResponse>) => res.data,
      providesTags: () => [TAGS.myTrips],
    }),
  }),
});

export const { useGetTripsQuery } = tripAPI;
