import { ENDPOINTS } from "@/lib/utils";
import { baseAPI } from "../..";
import { ApiResponse } from "../../common-types";
import { PricingCategory, PricingData } from "../types";


export const tripPricingAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    savePricing: builder.mutation<
      ApiResponse<PricingData>,
      { organizationId: string; tripId: number; pricingData: PricingData }
    >({
      query: ({ organizationId, tripId, pricingData }) => ({
        url: ENDPOINTS.TRIP_PRICING(organizationId, tripId),
        method: "POST",
        body: pricingData,
      }),
      invalidatesTags: ["tripPricing"],
    }),

    updatePricing: builder.mutation<
      ApiResponse<PricingData>,
      { organizationId: string; tripId: number; pricingData: PricingData }
    >({
      query: ({ organizationId, tripId, pricingData }) => ({
        url: ENDPOINTS.TRIP_PRICING(organizationId, tripId),
        method: "PUT",
        body: pricingData,
      }),
      invalidatesTags: ["tripPricing"],
    }),

    getPricing: builder.query<
      ApiResponse<PricingData>,
      { organizationId: string; tripId: number }
    >({
      query: ({ organizationId, tripId }) =>
        ENDPOINTS.TRIP_PRICING(organizationId, tripId),
      providesTags: ["tripPricing"],
    }),
  }),
});

export const {
  useSavePricingMutation,
  useUpdatePricingMutation,
  useGetPricingQuery,
} = tripPricingAPI;
