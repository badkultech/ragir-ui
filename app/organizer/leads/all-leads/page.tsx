"use client";

import { useState } from "react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { AppHeader } from "@/components/app-header";
import { ConfirmConversionModal } from "@/components/organizer/ConfirmConversionModal";

import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useGetAllTripLeadsQuery, useUpdateTripLeadMutation } from "@/lib/services/organizer/trip/leads";
import { TripLeadsStatus } from "@/lib/services/organizer/trip/leads/types";

export default function AllLeadsPage() {
  const organizationId = useOrganizationId();
  const { data: leads = [], isLoading, refetch } = useGetAllTripLeadsQuery(organizationId);

  const [updateTripLead] = useUpdateTripLeadMutation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleConfirmConversion = () => {
    if (selectedLead) markAsConverted(selectedLead);
  };

  const markAsConverted = async (id: string) => {
    const formData = new FormData();
    formData.append("tripLeadsStatus", TripLeadsStatus.CLOSED);
    try {
      await updateTripLead({
        organizationId,
        tripId: "", // not needed in endpoint, RTK handles path internally
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

          {/* Search + Filters */}
          <div className="flex flex-wrap gap-3 mb-6 items-center">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search"
                className="w-full rounded-full border border-gray-200 bg-white shadow-sm h-9 sm:h-10 text-sm px-4 focus-visible:ring-1 focus-visible:ring-gray-300"
              />
            </div>

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
            {isLoading ? (
              <p>Loading leads...</p>
            ) : leads.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">No leads found</p>
            ) : (
              leads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row sm:justify-between sm:items-start"
                >
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-semibold text-gray-800">
                        {lead.tripTitle || "Unnamed Lead"}
                      </h2>
                      {lead.tripLeadsStatus === "NEW" && (
                        <Badge className="bg-yellow-100 text-yellow-700">
                          Open
                        </Badge>
                      )}
                      {lead.tripLeadsStatus === "CLOSED" && (
                        <Badge className="bg-gray-100 text-gray-600">
                          Closed
                        </Badge>
                      )}
                      {lead.tripLeadsStatus === TripLeadsStatus.IN_PROGRESS && (
                        <Badge className="bg-orange-100 text-orange-700">
                          In Progress
                        </Badge>
                      )}
                      {lead.tripLeadsStatus === TripLeadsStatus.CONVERTED && (
                        <Badge className="bg-green-100 text-green-700">
                          Converted
                        </Badge>
                      )}
                      {(lead.nudgeCount ?? 0) > 0 && (
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

                  <div className="flex flex-col items-end mt-3 sm:mt-0">
                    <p className="text-sm text-gray-400">
                      {new Date().toLocaleDateString()}
                    </p>
                    {lead.tripLeadsStatus === "NEW" && (
                      <Button
                        onClick={() => {
                          setSelectedLead(lead.id.toString());
                          setShowModal(true);
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white rounded-md mt-3"
                      >
                        Mark as Converted
                      </Button>
                    )}
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
