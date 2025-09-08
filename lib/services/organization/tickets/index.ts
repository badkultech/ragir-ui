import { ENDPOINTS } from "@/lib/utils";
import { baseAPI } from "../..";
import {
  CreateTicketRequest,
  Ticket,
  TicketResponse,
  CreateTicketResponse,
  AddMessageResponse,
  AddMessageRequest,
  TicketDetailResponse,
  TicketDetail,
  TicketComment,
  CreateCommentRequest,
  TicketCommentResponse,
} from "./types";
import { Message } from "react-hook-form";

export const ticketsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getTickets: builder.query<Ticket[], { organizationId: string }>({
      query: ({ organizationId }) => ({
        url: ENDPOINTS.ORGANIZATION_TICKETS(organizationId),
        method: "GET",
      }),
      transformResponse: (response: TicketResponse) => response.data, // Extract data array
      providesTags: ["tickets"],
    }),

    createTicket: builder.mutation<
      Ticket,
      { organizationId: string; userId: string; payload: CreateTicketRequest }
    >({
      query: ({ organizationId, userId, payload }) => ({
        url: ENDPOINTS.USER_TICKET(organizationId, userId),
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: CreateTicketResponse) => response.data,
      invalidatesTags: ["tickets"],
    }),
    getTicketById: builder.query<
      TicketDetail,
      { organizationId: string; ticketId: string, userId: string }
    >({
      query: ({ organizationId, ticketId, userId }) => ({
        url: `/org/${organizationId}/user/${userId}/tickets/${ticketId}`,
        method: "GET",
      }),
      transformResponse: (response: TicketDetailResponse) => response.data,
      providesTags: (result, error, { ticketId }) => [
        { type: "tickets", id: ticketId },
        "tickets",
      ],
    }),

     // Updated to match your backend endpoint
    addComment: builder.mutation<TicketComment, { ticketId: string; payload: CreateCommentRequest, organizationId : string, userId : string }>({
      query: ({ ticketId, payload, organizationId, userId }) => ({
        url: `/org/${organizationId}/user/${userId}/ticket/${ticketId}/comment`, // Matches your @PostMapping("/{ticketId}/comment")
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: TicketCommentResponse) => response.data,
      invalidatesTags: (result, error, { ticketId }) => [
        { type: "tickets", id: ticketId },
        "tickets"
      ],
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useCreateTicketMutation,
  useGetTicketByIdQuery,
  useAddCommentMutation,
} = ticketsAPI;
