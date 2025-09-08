import { baseAPI } from "../..";
import { ENDPOINTS } from "@/lib/utils";
import type {
  CmsPageDTO,
  CmsSectionDTO,
  CreateCmsPageDTO,
  CreateCmsSectionDTO,
  UpdateCmsPageDTO,
  UpdateCmsSectionDTO,
} from "./types";

export const cmsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // ----------- Queries -----------
    getPageBySlug: builder.query<
      CmsPageDTO,
      { slug: string; showFullLoader?: boolean }
    >({
      query: ({ slug, ...args }) => ({
        url: ENDPOINTS.CMS_PAGE(slug),
        method: "GET",
        ...args,
      }),
      providesTags: (result, error, { slug }) => [
        { type: "cmsPages", id: slug },
      ],
    }),

    listPages: builder.query<CmsPageDTO[], { showFullLoader?: boolean }>({
      query: (args) => ({
        url: ENDPOINTS.CMS_PAGES,
        method: "GET",
        ...args,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((page) => ({
                type: "cmsPages" as const,
                id: page.id,
              })),
              { type: "cmsPages", id: "LIST" },
            ]
          : [{ type: "cmsPages", id: "LIST" }],
    }),

    // ----------- Page Mutations -----------
    createPage: builder.mutation<CmsPageDTO, CreateCmsPageDTO>({
      query: (payload) => ({
        url: ENDPOINTS.CMS_PAGES,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "cmsPages", id: "LIST" }],
    }),

    getPageById: builder.query<CmsPageDTO, number>({
      query: (id) => `/master/cms/pages/${id}`,
      providesTags: (result, error, id) => [{ type: "cmsPages", id }],
    }),

    updatePage: builder.mutation<
      CmsPageDTO,
      { id: number; payload: UpdateCmsPageDTO }
    >({
      query: ({ id, payload }) => ({
        url: ENDPOINTS.CMS_PAGE_BY_ID(id),
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "cmsPages", id }],
    }),

    deletePage: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: ENDPOINTS.CMS_PAGE_BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "cmsPages", id: "LIST" }],
    }),

    // ----------- Section Mutations -----------
    addSection: builder.mutation<
      CmsSectionDTO,
      { pageId: number; payload: CreateCmsSectionDTO }
    >({
      query: ({ pageId, payload }) => ({
        url: ENDPOINTS.CMS_SECTIONS(pageId),
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { pageId }) => [
        { type: "cmsPages", id: pageId },
      ],
    }),

    updateSection: builder.mutation<
      CmsSectionDTO,
      { pageId: number; sectionId: number; payload: UpdateCmsSectionDTO }
    >({
      query: ({ pageId, sectionId, payload }) => ({
        url: ENDPOINTS.CMS_SECTION_BY_ID(pageId, sectionId),
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { pageId }) => [
        { type: "cmsPages", id: pageId },
      ],
    }),

    deleteSection: builder.mutation<
      void,
      { pageId: number; sectionId: number }
    >({
      query: ({ pageId, sectionId }) => ({
        url: ENDPOINTS.CMS_SECTION_BY_ID(pageId, sectionId),
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { pageId }) => [
        { type: "cmsPages", id: pageId },
      ],
    }),
    createSection: builder.mutation<
      CmsSectionDTO,
      {
        pageId: number;
        payload: Omit<CmsSectionDTO, "id" | "createdAt" | "updatedAt">;
      }
    >({
      query: ({ pageId, payload }) => ({
        url: `/master/cms/pages/${pageId}/sections`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["cmsPages"],
    }),
    getAllPages: builder.query<CmsPageDTO[], void>({
      query: () => "/master/cms/pages",
      providesTags: ["cmsPages"],
    }),
  }),
});

export const {
  useGetPageBySlugQuery,
  useListPagesQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useDeletePageMutation,
  useAddSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useCreateSectionMutation,
  useGetPageByIdQuery,
  useGetAllPagesQuery,
} = cmsAPI;
