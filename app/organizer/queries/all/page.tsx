"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import QueryList from "@/components/queries/QueryList";
import ConfirmDeleteModal from "@/components/queries/ConfirmDeleteModal";
import ReportQueryModal from "@/components/queries/ReportQueryModal";
import QueryDetail from "@/components/queries/QueryDetail";
import { queriesData } from "@/lib/mock-data/user-queries/mock-queries";

export default function AllQueriesPage() {
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
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link
                  href="/queries"
                  className="hover:text-[#F97316] transition-colors"
                >
                  Queries
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-700 font-medium">All Queries</span>
              </div>

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
