"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { AppHeader } from "@/components/app-header";
import Link from "next/link";
import { ConfirmConversionModal } from "@/components/organizer/ConfirmConversionModal";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  trip: string;
  status: "open" | "converted" | "closed";
  nudged?: boolean;
  prefers?: "phone" | "email";
  message?: string;
  date: string;
}

const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    email: "useremail12@gmail.com",
    phone: "+91 9890 980812",
    trip: "Ladakh Adventure",
    status: "open",
    nudged: true,
    prefers: "phone",
    date: "25-08-2025",
  },
  {
    id: "2",
    name: "Amit Kumar",
    email: "useremail12@gmail.com",
    phone: "+91 9890 980812",
    trip: "Ladakh Adventure",
    status: "closed",
    message: "What is the difficulty level ?",
    date: "25-08-2025",
  },
  {
    id: "3",
    name: "Amit Kumar",
    email: "useremail12@gmail.com",
    phone: "+91 9890 980812",
    trip: "Ladakh Adventure",
    status: "converted",
    message: "What is the difficulty level ?",
    date: "25-08-2025",
  },
  {
    id: "4",
    name: "Rahul Sharma",
    email: "useremail12@gmail.com",
    phone: "+91 9890 980812",
    trip: "Ladakh Adventure",
    status: "open",
    nudged: true,
    prefers: "phone",
    date: "25-08-2025",
  },
];

export default function AllLeadsPage() {
  const [leads, setLeads] = useState(mockLeads);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const handleConfirmConversion = () => {
    if (selectedLead) {
      markAsConverted(selectedLead);
    }
  };

  const markAsConverted = (id: string) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, status: "converted" } : lead
      )
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <AppHeader title="All Leads" />

        <div className="p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/organizer/leads" className="hover:underline">
              Leads
            </Link>
            <span>{">"}</span>
            <span className="text-gray-700 font-medium">All Leads</span>
          </div>

          {/* 🔍 Search + Filters */}
          <div className="flex flex-wrap gap-3 mb-6 items-center">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search"
                className="w-full rounded-full border border-gray-200 bg-white shadow-sm h-9 sm:h-10 text-sm px-4 focus-visible:ring-1 focus-visible:ring-gray-300"
              />
            </div>

            {/* Filters */}
            <select className="appearance-none border border-gray-200 rounded-full bg-white px-4 pr-8 py-2 h-9 sm:h-10 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-300 hover:border-gray-300 cursor-pointer">
              <option>All Status</option>
              <option>Open</option>
              <option>Closed</option>
              <option>Converted</option>
              <option>Nudged Again</option>
            </select>

            <select className="appearance-none border border-gray-200 rounded-full bg-white px-4 pr-8 py-2 h-9 sm:h-10 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-300 hover:border-gray-300 cursor-pointer">
              <option>Sort By</option>
              <option>Newest to Oldest</option>
              <option>Oldest to Newest</option>
            </select>
          </div>

          {/* Lead Cards */}
          <div className="space-y-4">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row sm:justify-between sm:items-start"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold text-gray-800">{lead.name}</h2>
                    {lead.status === "open" && (
                      <Badge className="bg-yellow-100 text-yellow-700">
                        Open
                      </Badge>
                    )}
                    {lead.status === "converted" && (
                      <Badge className="bg-green-100 text-green-700">
                        Converted
                      </Badge>
                    )}
                    {lead.status === "closed" && (
                      <Badge className="bg-gray-100 text-gray-600">
                        Closed
                      </Badge>
                    )}
                    {lead.nudged && (
                      <Badge className="bg-blue-100 text-blue-700">
                        Nudged Again
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    Trip:{" "}
                    <span className="font-medium text-gray-700">
                      {lead.trip}
                    </span>
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-1">
                    <span>📞 {lead.phone}</span>
                    <span>✉️ {lead.email}</span>
                    {lead.prefers && (
                      <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-md">
                        Prefers {lead.prefers}
                      </span>
                    )}
                  </div>

                  {lead.message && (
                    <p className="text-gray-700 text-sm mt-2 border rounded-md p-2 bg-gray-50">
                      {lead.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end mt-3 sm:mt-0">
                  <p className="text-sm text-gray-400">{lead.date}</p>
                  <div className="flex flex-wrap gap-3 mt-4 justify-end">
                    {lead.status === "open" && (
                      <Button
                        onClick={() => {
                          setSelectedLead(lead.id);
                          setShowModal(true);
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white rounded-md flex-1 sm:flex-none"
                      >
                        Mark as Converted
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <ConfirmConversionModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmConversion}
        />
      </div>
    </div>
  );
}
