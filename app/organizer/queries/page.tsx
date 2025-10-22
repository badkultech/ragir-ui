"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import ConfirmDeleteModal from "@/components/queries/ConfirmDeleteModal";
import QueryDetail from "@/components/queries/QueryDetail";
import QueryList from "@/components/queries/QueryList";
import QueryStats from "@/components/queries/QueryStats";
import ReportQueryModal from "@/components/queries/ReportQueryModal";
import { queriesData } from "@/lib/mock-data/user-queries/mock-queries";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function QueriesPage() {
  const [selectedQuery, setSelectedQuery] = useState<any>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] overflow-x-hidden">
      {/* Sidebar */}
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AppHeader title="Queries" />

        <div className="p-6">
          {!selectedQuery ? (
            <>
              {/* Heading + "View All" button */}
              <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Ladakh Adventure – Complete Leh Circuit with Nubra Valley
                </h2>
                <Link href="/organizer/queries/all">
                  <Button className="bg-[#F97316] hover:bg-[#ea6d14] text-white px-6 rounded-lg">
                    View All Queries
                  </Button>
                </Link>
              </div>

              {/* Stats Section */}
              <QueryStats />

              {/* Query List */}
              <QueryList
                queries={queriesData}
                onViewQuery={setSelectedQuery}
                onDelete={() => setShowDelete(true)}
              />
            </>
          ) : (
            <QueryDetail
              query={selectedQuery}
              onBack={() => setSelectedQuery(null)}
              onReport={() => setShowReport(true)}
            />
          )}

          {/* Modals */}
          <ConfirmDeleteModal
            open={showDelete}
            onClose={() => setShowDelete(false)}
          />
          <ReportQueryModal
            open={showReport}
            onClose={() => setShowReport(false)}
          />
        </div>
      </div>
    </div>
  );
}
