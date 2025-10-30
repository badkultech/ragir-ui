"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { AppHeader } from "@/components/app-header";
import { ConfirmConversionModal } from "@/components/organizer/ConfirmConversionModal";

import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useDeleteTripLeadMutation, useGetTripLeadsQuery, useUpdateTripLeadMutation } from "@/lib/services/organizer/trip/leads";
import { TripLeadsStatus } from "@/lib/services/organizer/trip/leads/types";


export default function LeadsPage() {
  const { tripId } = useParams();
  const organizationId = useOrganizationId();

  const { data: leads = [], isLoading, refetch } = useGetTripLeadsQuery({
    organizationId,
    tripId: tripId as string,
  });

  const [updateTripLead] = useUpdateTripLeadMutation();
  const [deleteTripLead] = useDeleteTripLeadMutation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleConfirmConversion = () => {
    if (selectedLead) {
      markAsConverted(selectedLead);
    }
  };

  const markAsConverted = async (id: string) => {
    const formData = new FormData();
    formData.append("tripLeadsStatus", TripLeadsStatus.CLOSED); // or "CONVERTED"
    try {
      await updateTripLead({
        organizationId,
        tripId: tripId as string,
        leadId: id,
        data: formData,
      }).unwrap();
      refetch();
    } catch (err) {
      console.error("Error updating lead:", err);
    } finally {
      setShowModal(false);
      setSelectedLead(null);
    }
  };

  const deleteLead = async (id: string) => {
    try {
      await deleteTripLead({
        organizationId,
        tripId: tripId as string,
        leadId: id,
      }).unwrap();
      refetch();
    } catch (err) {
      console.error("Error deleting lead:", err);
    }
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
              Trip Leads Overview
            </h1>
            <Button
              asChild
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-md px-5 py-2"
            >
              <Link href="/organizer/leads/all-leads">View All Leads</Link>
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
                  .filter((l) => l.tripLeadsStatus === "NEW")
                  .length.toString()
                  .padStart(2, "0")}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <p className="text-gray-600 text-sm">Converted</p>
              <p className="text-xl font-bold mt-1">
                {leads
                  .filter((l) => l.tripLeadsStatus === "CLOSED")
                  .length.toString()
                  .padStart(2, "0")}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6 items-center">
            <div className="flex-1 min-w-[180px] sm:min-w-[220px]">
              <Input
                placeholder="Search"
                className="w-full rounded-full border border-gray-200 bg-white h-9 sm:h-10 text-sm px-4 shadow-sm focus-visible:ring-1 focus-visible:ring-gray-300"
              />
            </div>

            <Select>
              <SelectTrigger className="w-[160px] rounded-full border border-gray-200 h-9 sm:h-10 text-sm bg-white shadow-sm">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-gray-200 bg-white shadow-lg">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="nudged">Nudged Again</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[160px] rounded-full border border-gray-200 h-9 sm:h-10 text-sm bg-white shadow-sm">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-gray-200 bg-white shadow-lg">
                <SelectItem value="newest">Newest to Oldest</SelectItem>
                <SelectItem value="oldest">Oldest to Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Leads List */}
          <div className="space-y-4">
            {isLoading ? (
              <p>Loading leads...</p>
            ) : leads.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">No leads found</p>
            ) : (
              leads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                >
                  {/* Top Row */}
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-semibold text-gray-800">
                          {lead.tripTitle || "Unnamed Lead"}
                        </h2>
                        {lead.tripLeadsStatus === "NEW" ? (
                          <Badge className="bg-yellow-100 text-yellow-700">
                            Open
                          </Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-700">
                            Converted
                          </Badge>
                        )}
                        {lead.nudgeCount && lead.nudgeCount > 0 && (
                          <Badge className="bg-blue-100 text-blue-700">
                            Nudged Again
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-1">
                        <span>📞 {lead.phone}</span>
                        <span>✉️ {lead.email}</span>
                        {lead.preferredCommunication && (
                          <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-md">
                            Prefers{" "}
                            {lead.preferredCommunication
                              .toString()
                              .toLowerCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-3 mt-4 justify-end">
                    {lead.tripLeadsStatus === "NEW" && (
                      <Button
                        onClick={() => {
                          setSelectedLead(lead.id.toString());
                          setShowModal(true);
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white rounded-md flex-1 sm:flex-none"
                      >
                        Mark as Converted
                      </Button>
                    )}
                    <button
                      onClick={() => deleteLead(lead.id.toString())}
                      className="border border-red-300 p-2 rounded-md hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))
            )}
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
