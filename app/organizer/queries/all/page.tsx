"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import QueryList from "@/components/queries/QueryList";
import ConfirmDeleteModal from "@/components/queries/ConfirmDeleteModal";
import ReportQueryModal from "@/components/queries/ReportQueryModal";
import QueryDetail from "@/components/queries/QueryDetail";
import { useDeleteTripQueryMutation, useGetAllTripQueriesQuery, useGetTripQueriesQuery } from "@/lib/services/organizer/trip/queries";
import { useOrganizationId } from "@/hooks/useOrganizationId";


export default function AllQueriesPage() {
  const params = useParams() as { organizationId?: string; tripPublicId?: string };
  const organizationId = useOrganizationId();
  const tripPublicId = params?.tripPublicId ?? "";

  const [selectedQuery, setSelectedQuery] = useState<any>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  // 1) Fetch org-wide queries (depends only on organizationId)
  const {
    data: orgQueries,
    isLoading: isOrgLoading,
    isError: isOrgError,
    refetch: refetchOrgQueries,
  } = useGetAllTripQueriesQuery(organizationId, {
    skip: !organizationId,
  });

  // 2) Fetch trip-specific queries (depends on org + trip)
  const {
    data: tripQueries,
    isLoading: isTripLoading,
    isFetching: isTripFetching,
    isError: isTripError,
    refetch: refetchTripQueries,
  } = useGetTripQueriesQuery(
    { organizationId, tripPublicId },
    {
      skip: !organizationId || !tripPublicId,
    }
  );

  // Delete mutation (optional: ensure it's added in your RTK slice)
  const [deleteTripQuery, { isLoading: isDeleting }] = useDeleteTripQueryMutation();

  // Which list to show:
  // - if tripPublicId present and tripQueries exist -> show tripQueries
  // - otherwise fall back to orgQueries
  const displayedQueries = tripPublicId ? tripQueries ?? [] : orgQueries ?? [];

  // handle delete flow
  const onDeleteClick = (query: any) => {
    setPendingDeleteId(query?.id ?? null);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) {
      setShowDelete(false);
      return;
    }

    try {
      // call delete mutation if available
      if (deleteTripQuery) {
        // Prefer deleting with tripPublicId if available, else call org-level delete route shape (if exists)
        await deleteTripQuery({
          organizationId,
          tripPublicId: tripPublicId || "", // backend might accept empty; adjust if you need an org-level delete route
          queryId: pendingDeleteId,
        }).unwrap();
      }

      // refresh whichever list is currently displayed
      if (tripPublicId) {
        await refetchTripQueries();
      } else {
        await refetchOrgQueries();
      }

      setShowDelete(false);
      setSelectedQuery(null);
      setPendingDeleteId(null);
    } catch (err) {
      console.error("Failed to delete query", err);
      // surface a toast/snackbar here if you have one
    }
  };

  const onReport = (query: any) => {
    setSelectedQuery(query);
    setShowReport(true);
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] overflow-x-hidden">
      {/* Sidebar */}
      <OrganizerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AppHeader title="Queries" />

        <div className="p-6">
          {!selectedQuery ? (
            <>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link href="/queries" className="hover:text-[#F97316] transition-colors">
                  Queries
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-700 font-medium">All Queries</span>
              </div>

              {/* Loading / Error states */}
              {((tripPublicId && (isTripLoading || isTripFetching)) ||
                (!tripPublicId && isOrgLoading)) ? (
                <div className="py-20 text-center text-gray-500">Loading queries…</div>
              ) : (tripPublicId && isTripError) || (!tripPublicId && isOrgError) ? (
                <div className="py-20 text-center text-red-500">Failed to load queries. Try refreshing.</div>
              ) : !displayedQueries || displayedQueries.length === 0 ? (
                <div className="py-20 text-center text-gray-500">
                  {tripPublicId
                    ? "No queries found for this trip."
                    : "No queries found for this organization."}
                </div>
              ) : (
                // Query List
                <QueryList
                  queries={displayedQueries}
                  onViewQuery={(q: any) => setSelectedQuery(q)}
                  onDelete={(q: any) => onDeleteClick(q)}
                  onReport={(q: any) => onReport(q)}
                />
              )}
            </>
          ) : (
            <QueryDetail
              query={selectedQuery}
              onBack={() => setSelectedQuery(null)}
              onReport={() => setShowReport(true)}
              onDelete={() => onDeleteClick(selectedQuery)}
            />
          )}

          {/* Modals */}
          <ConfirmDeleteModal
            open={showDelete}
            onClose={() => {
              setShowDelete(false);
              setPendingDeleteId(null);
            }}
            onConfirm={confirmDelete}
            loading={isDeleting}
          />
          <ReportQueryModal
            open={showReport}
            onClose={() => setShowReport(false)}
            query={selectedQuery}
          />
        </div>
      </div>
    </div>
  );
}
