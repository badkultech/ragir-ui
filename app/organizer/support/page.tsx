"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { PlusCircle } from "lucide-react";
import { AddNewTicketModal } from "@/components/organizer/support/AddNewTicketModal";
import { ViewTicketModal } from "@/components/organizer/support/ViewTicketModal";
import { getStatusClasses } from "@/lib/utils/getStatusStyles";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { useAddCommentMutation, useGetAllTicketsQuery } from "@/lib/services/organizer/support";


const tickets = [
  {
    id: "#T-1024",
    title: "Unable to upload trip images",
    description: "When I try to upload images for my trip, I receive an error message saying 'Upload failed. Please try again.' I've tried multiple browsers and cleared my cache, but the issue persists. Please assist.",
    status: "Open",
    created: "2 hours ago",
    updated: "2 hours ago",
  },
  {
    id: "#T-1025",
    title: "Unable to upload trip images",
    description: "When I try to upload images for my trip, I receive an error message saying 'Upload failed. Please try again.' I've tried multiple browsers and cleared my cache, but the issue persists. Please assist.",
    status: "In Progress",
    created: "2 hours ago",
    updated: "2 hours ago",
  },
  {
    id: "#T-1026",
    title: "Unable to upload trip images",
    description: "When I try to upload images for my trip, I receive an error message saying 'Upload failed. Please try again.' I've tried multiple browsers and cleared my cache, but the issue persists. Please assist.",
    status: "In Progress",
    created: "2 hours ago",
    updated: "2 hours ago",
  },
  {
    id: "#T-1027",
    title: "Unable to upload trip images",
    description: "When I try to upload images for my trip, I receive an error message saying 'Upload failed. Please try again.' I've tried multiple browsers and cleared my cache, but the issue persists. Please assist.",
    status: "Resolved",
    created: "2 hours ago",
    updated: "2 hours ago",
  },
];

export default function SupportCenter() {
  const { userData } = useSelector(selectAuthState);
  const { data: tickets = [], isLoading } = useGetAllTicketsQuery(userData?.userPublicId || "");
  const [filter, setFilter] = useState<
    "All" | "Open" | "In Progress" | "Resolved"
  >("All");
  const [SidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const filteredTickets =
    filter === "All" ? tickets : tickets.filter((t) => t.status === filter);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [addComment] = useAddCommentMutation();
  const total = tickets.length;
  const open = tickets.filter((t) => t.status === "Open").length;
  const inProgress = tickets.filter((t) => t.status === "In Progress").length;
  const resolved = tickets.filter((t) => t.status === "Resolved").length;


  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <OrganizerSidebar
        isOpen={SidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1">
        <AppHeader
          title="Support Center"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Row with New Ticket Button */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">
              Support Center
            </h1>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusCircle className="w-4 h-4" />
              New Ticket
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-orange-500 border">
              <CardContent className="p-4 text-center">
                <p className="text-sm font-medium text-gray-500">
                  Total Tickets
                </p>
                <h2 className="text-2xl font-bold text-orange-600">24</h2>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm font-medium text-gray-500">
                  Open Tickets
                </p>
                <h2 className="text-2xl font-bold text-gray-800">05</h2>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <h2 className="text-2xl font-bold text-gray-800">05</h2>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm font-medium text-gray-500">Resolved</p>
                <h2 className="text-2xl font-bold text-gray-800">07</h2>
              </CardContent>
            </Card>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-3 border-b pb-2">
            {["All", "Open", "In Progress", "Resolved"].map((tab) => {
              const isActive = filter === tab;
              const color =
                tab === "Open"
                  ? "text-yellow-600 border-yellow-400"
                  : tab === "In Progress"
                    ? "text-blue-600 border-blue-400"
                    : tab === "Resolved"
                      ? "text-green-600 border-green-400"
                      : "text-gray-600 border-gray-300";

              return (
                <Button
                  key={tab}
                  variant="ghost"
                  onClick={() => setFilter(tab as any)}
                  className={`rounded-full border ${isActive
                    ? `bg-white font-semibold ${color}`
                    : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {tab}
                </Button>
              );
            })}
          </div>


          {/* Ticket List */}
          <div className="space-y-3">
            {isLoading ? (
              <p className="text-center text-gray-500 mt-6">Loading tickets...</p>
            ) : tickets.length === 0 ? (
              <p className="text-center text-gray-400 mt-6">No tickets found.</p>
            ) : (
              filteredTickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="hover:shadow-md transition-all cursor-pointer"
                >
                  <CardContent className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 gap-3">
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-[18px]">
                        #{ticket.id}
                        <span
                          className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(
                            ticket.status
                          )}`}
                        >
                          {ticket.status}
                        </span>
                      </p>
                      <p className="text-gray-600 py-1 text-[17px]">{ticket.title}</p>
                      <p className="text-sm text-gray-400">
                        {ticket.category} • {ticket.priority}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}

          </div>

        </main>
      </div>
      <AddNewTicketModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ViewTicketModal
        open={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        ticket={selectedTicket}
        onAddComment={async (ticketId, comment) => {
          await addComment({
            ticketId,
            data: { comment },
          }).unwrap();
        }}
      />
    </div>
  );
}
