// services/trips.ts
import { baseAPI } from "../..";
import { TripSummary, PageResponse, TripsApiResponse } from "./types";

// Make sure your RTK Query looks like this:
export const tripsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getTrips: builder.query<
      PageResponse<TripSummary>, 
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
        
        return {
          url: `/org/${organizationId}/trip?${params.toString()}`,
          method: "GET",
        };
      },
      // Remove transformResponse entirely - let RTK Query use the response as-is
      providesTags: ["trips"],
    }),
  }),
});
export const { useGetTripsQuery } = tripsAPI;