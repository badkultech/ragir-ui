"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { AppHeader } from "@/components/app-header";
import { ConfirmConversionModal } from "@/components/organizer/ConfirmConversionModal";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  trip: string;
  status: "open" | "converted";
  nudged?: boolean;
  prefers?: "phone" | "email";
  message?: string;
  date: string;
}

const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    email: "Useremail12@gmail.com",
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
    email: "Useremail12@gmail.com",
    phone: "+91 9890 980812",
    trip: "Ladakh Adventure",
    status: "converted",
    message: "What is the difficulty level?",
    date: "25-08-2025",
  },
  {
    id: "3",
    name: "Rahul Sharma",
    email: "Useremail12@gmail.com",
    phone: "+91 9890 980812",
    trip: "Ladakh Adventure",
    status: "open",
    nudged: true,
    prefers: "phone",
    date: "25-08-2025",
  },
];

export default function LeadsPage() {
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

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] overflow-x-hidden">

      {/* Sidebar */}
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AppHeader title="Leads" />

        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800">
              Ladakh Adventure – Complete Leh Circuit with Nubra Valley
            </h1>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-md px-5 py-2">
              View All Leads
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <p className="text-gray-600 text-sm">Total Leads</p>
              <p className="text-xl font-bold mt-1">
                {leads.length.toString().padStart(2, "0")}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <p className="text-gray-600 text-sm">Open Leads</p>
              <p className="text-xl font-bold mt-1">
                {leads
                  .filter((l) => l.status === "open")
                  .length.toString()
                  .padStart(2, "0")}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <p className="text-gray-600 text-sm">Converted</p>
              <p className="text-xl font-bold mt-1">
                {leads
                  .filter((l) => l.status === "converted")
                  .length.toString()
                  .padStart(2, "0")}
              </p>
            </div>
          </div>

          {/* 🔍 Search + Filters Section */}
          <div className="flex flex-wrap gap-3 mb-6 items-center">
            {/* Search Input */}
            <div className="flex-1 min-w-[180px] sm:min-w-[220px]">
              <Input
                placeholder="Search"
                className="
        w-full
        rounded-md
        bg-white
        border border-gray-200
        shadow-sm
        focus-visible:ring-0
        focus:border-gray-300
        h-9 sm:h-10
        text-sm
      "
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                className="
        appearance-none
        border border-gray-200
        rounded-md
        bg-white
        px-3 sm:px-4
        pr-8
        py-1.5 sm:py-2
        h-9 sm:h-10
        text-xs sm:text-sm
        text-gray-700
        shadow-sm
        focus:outline-none
        focus:ring-1
        focus:ring-gray-300
        hover:border-gray-300
        cursor-pointer
      "
              >
                <option>All Status</option>
                <option>Open</option>
                <option>Converted</option>
              </select>

              {/* Chevron Icon */}
              <svg
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <select
                className="
        appearance-none
        border border-gray-200
        rounded-md
        bg-white
        px-3 sm:px-4
        pr-8
        py-1.5 sm:py-2
        h-9 sm:h-10
        text-xs sm:text-sm
        text-gray-700
        shadow-sm
        focus:outline-none
        focus:ring-1
        focus:ring-gray-300
        hover:border-gray-300
        cursor-pointer
      "
              >
                <option>Sort By</option>
                <option>Newest to Oldest</option>
                <option>Oldest to Newest</option>
              </select>

              {/* Chevron Icon */}
              <svg
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>



          {/* Lead Cards */}
          <div className="space-y-4">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
              >
                {/* Top Row */}
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-semibold text-gray-800">
                        {lead.name}
                      </h2>
                      {lead.status === "open" ? (
                        <Badge className="bg-yellow-100 text-yellow-700">
                          Open
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-700">
                          Converted
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

                  <div className="mt-2 sm:mt-0 text-sm text-gray-400 sm:text-right">
                    {lead.date}
                  </div>
                </div>

                {/* Second Row (Buttons) */}
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
                  <button
                    onClick={() => deleteLead(lead.id)}
                    className="border border-red-300 p-2 rounded-md hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
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
