import { ENDPOINTS } from "@/lib/utils";
import { baseAPI } from "../..";
import { FAQItem } from "./types";

export const faqAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getFAQs: builder.query<FAQItem[], { showFullLoader?: boolean } | void>({
      query: (args) => ({
        url: ENDPOINTS.FAQ, // "/master/faq/all"
        method: "GET",
        ...(args || {}), // spread optional args like showFullLoader
      }),
      transformResponse: (response: { status: string; data: FAQItem[] }) => {
        return response?.data ?? [];
      },
      providesTags: ["faqs"],
    }),
  }),
});

export const { useGetFAQsQuery } = faqAPI;
