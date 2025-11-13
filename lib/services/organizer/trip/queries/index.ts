// services/tripQueryAPI.ts
import { ENDPOINTS } from "@/lib/utils";
import { baseAPI } from "@/lib/services";
import { TAGS } from "@/lib/services/tags";
import { ApiResponse } from "@/lib/services/common-types";
import { TripQueryResponse } from "./types";




/* ---------- API slice ---------- */

export const tripQueryAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        // Get all queries for a trip
        getTripQueries: builder.query<
            TripQueryResponse[],
            { organizationId: string; tripPublicId: string }
        >({
            query: ({ organizationId, tripPublicId }) => ({
                url: ENDPOINTS.ORGANIZER.TRIP_QUERIES(organizationId, tripPublicId),
                method: "GET",
            }),
            transformResponse: (res: ApiResponse<TripQueryResponse[]>) =>
                res.data,
            providesTags: [{ type: TAGS.tripQueries }],
        }),

        // Get single trip query by id
        getTripQueryById: builder.query<
            TripQueryResponse,
            { organizationId: string; tripPublicId: string; queryId: string | number }
        >({
            query: ({ organizationId, tripPublicId, queryId }) => ({
                url: `${ENDPOINTS.ORGANIZER.TRIP_QUERIES(
                    organizationId,
                    tripPublicId
                )}/${queryId}`,
                method: "GET",
            }),
            transformResponse: (res: ApiResponse<TripQueryResponse>) =>
                res.data,
            providesTags: [{ type: TAGS.tripQueries }],
        }),

        // Create a trip query (hits your @PostMapping controller)
        createTripQuery: builder.mutation<
            TripQueryResponse,
            { organizationId: string; tripPublicId: string; data: FormData }
        >({
            query: ({ organizationId, tripPublicId, data }) => ({
                url: ENDPOINTS.ORGANIZER.TRIP_QUERIES(organizationId, tripPublicId),
                method: "POST",
                body: data,
                // NOTE: If you need special headers (e.g. multipart boundary) leave it out;
                // fetch/axios will auto-handle FormData.
            }),
            transformResponse: (res: ApiResponse<TripQueryResponse>) =>
                res.data,
            invalidatesTags: [{ type: TAGS.tripQueries }],
        }),

        // Optional: get all queries for organization (org-wide)
        getAllTripQueries: builder.query<TripQueryResponse[], string>({
            query: (organizationId) => ({
                url: ENDPOINTS.ORGANIZER.TRIP_ORG_QUERIES(organizationId),
                method: "GET",
            }),
            transformResponse: (res: ApiResponse<TripQueryResponse[]>) =>
                res.data,
            providesTags: [{ type: TAGS.tripQueries }],
        }),

        deleteTripQuery: builder.mutation<
            { success: boolean; message?: string },
            { organizationId: string; tripPublicId: string; queryId: number | string }
        >({
            query: ({ organizationId, tripPublicId, queryId }) => ({
                url: `${ENDPOINTS.ORGANIZER.TRIP_QUERIES(organizationId, tripPublicId)}/${queryId}`,
                method: "DELETE",
            }),
            transformResponse: (res: ApiResponse<{ success: boolean }>) => res.data,
            invalidatesTags: [{ type: TAGS.tripQueries }],
        }),

    }),
});

export const {
    useGetTripQueriesQuery,
    useGetTripQueryByIdQuery,
    useCreateTripQueryMutation,
    useGetAllTripQueriesQuery,
    useDeleteTripQueryMutation,
} = tripQueryAPI;
