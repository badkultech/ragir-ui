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
import {
  useGetTripLeadsByStatusQuery,
  useUpdateTripLeadMutation,
} from "@/lib/services/organizer/trip/leads";
import { TripLeadsStatus } from "@/lib/services/organizer/trip/leads/types";
import { LeadFilters } from "@/components/leads/LeadFilters";

export default function AllLeadsPage() {
  const organizationId = useOrganizationId();

  // ✅ new local states
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const { data: leads = [], isLoading, refetch } = useGetTripLeadsByStatusQuery({
    organizationId,
    status,
  });

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
        tripId: "",
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

  // ✅ filter leads client-side if needed (search)
  const filteredLeads = leads.filter((lead) =>
    lead.tripTitle?.toLowerCase().includes(search.toLowerCase())
  );

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

          {/* ✅ Reusable filter component */}
          <LeadFilters
            onSearchChange={(val) => setSearch(val)}
            onStatusChange={(val) => setStatus(val)}
          />

          {/* Lead Cards */}
          <div className="space-y-4">
            {isLoading ? (
              <p>Loading leads...</p>
            ) : filteredLeads.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">No leads found</p>
            ) : (
              filteredLeads.map((lead) => (
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
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-1">
                      <span>📞 {lead.phone}</span>
                      <span>✉️ {lead.email}</span>
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
