"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { SidebarOpen } from "lucide-react";

const tickets = [
  {
    id: "#T-1024",
    title: "Unable to upload trip images",
    status: "Open",
    created: "2 hours ago",
    updated: "2 hours ago",
    user: "/user-avatar.png", // sample avatar path
  },
  {
    id: "#T-1025",
    title: "Unable to upload trip images",
    status: "In Progress",
    created: "2 hours ago",
    updated: "2 hours ago",
    user: "/user-avatar.png",
  },
  {
    id: "#T-1026",
    title: "Unable to upload trip images",
    status: "In Progress",
    created: "2 hours ago",
    updated: "2 hours ago",
    user: "/user-avatar.png",
  },
  {
    id: "#T-1027",
    title: "Unable to upload trip images",
    status: "Resolved",
    created: "2 hours ago",
    updated: "2 hours ago",
    user: "/user-avatar.png",
  },
];

export default function SupportCenter() {
  const [filter, setFilter] = useState<
    "All" | "Open" | "In Progress" | "Resolved"
  >("All");
  const [SidebarOpen, setSidebarOpen] = useState(false);
  const filteredTickets =
    filter === "All" ? tickets : tickets.filter((t) => t.status === filter);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <OrganizerSidebar
        isOpen={SidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1">
        <AppHeader title="Support Center"  onMenuClick={() => setSidebarOpen(true)} />
        <div className="p-6 space-y-6">
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
            {["All", "Open", "In Progress", "Resolved"].map((tab) => (
              <Button
                key={tab}
                variant={filter === tab ? "default" : "ghost"}
                onClick={() => setFilter(tab as any)}
                className={`rounded-full ${
                  filter === tab ? "bg-orange-500 text-white" : "text-gray-600"
                }`}
              >
                {tab}
              </Button>
            ))}
          </div>

          {/* Ticket List */}
          <div className="space-y-3">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-md transition-all">
                <CardContent className="flex justify-between items-center p-4">
                  <div>
                    <p className="font-semibold text-gray-800">{ticket.id}</p>
                    <p className="text-gray-600">{ticket.title}</p>
                    <p className="text-sm text-gray-400">
                      Created: {ticket.created} | Last updated: {ticket.updated}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className={
                        ticket.status === "Open"
                          ? "bg-red-100 text-red-700"
                          : ticket.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }
                    >
                      {ticket.status}
                    </Badge>
                    <img
                      src={ticket.user}
                      alt="User avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
