import { baseAPI } from "@/lib/services";
import { ApiResponse } from "@/lib/services/common-types";
import { WishlistTripsResponse, TripExistsResponse, Pageable } from "@/lib/services/wishlist/types";
import { TAGS } from "@/lib/services/tags";

export const wishlistAPI = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        addTripToWishlist: builder.mutation<void, { tripId: string }>({
            query: ({ tripId }) => ({
                url: `/wishlist/trips/${tripId}`,
                method: "POST",
            }),
            invalidatesTags: () => [TAGS.wishlist],
        }),

        removeTripFromWishlist: builder.mutation<void, { tripId: string }>({
            query: ({ tripId }) => ({
                url: `/wishlist/trips/${tripId}`,
                method: "DELETE",
            }),
            invalidatesTags: () => [TAGS.wishlist],
        }),

        getWishlistTrips: builder.query<WishlistTripsResponse, void>({
            query: () => ({
                url: `/wishlist/trips`,
                method: "GET",
            }),
            transformResponse: (res: ApiResponse<WishlistTripsResponse>) => res.data,
            providesTags: () => [TAGS.wishlist],
        }),

        checkTripInWishlist: builder.query<boolean, { tripId: string }>({
            query: ({ tripId }) => ({
                url: `/wishlist/trips/${tripId}/exists`,
                method: "GET",
            }),
            transformResponse: (res: ApiResponse<TripExistsResponse>) => res.data.exists,
            providesTags: (result, error, { tripId }) => [
                { type: TAGS.wishlist, id: tripId },
            ],
        }),
    }),
});

export const {
    useAddTripToWishlistMutation,
    useRemoveTripFromWishlistMutation,
    useGetWishlistTripsQuery,
    useCheckTripInWishlistQuery,
} = wishlistAPI;

export type { WishlistTrip } from "@/lib/services/wishlist/types";
