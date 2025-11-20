// Updated SwitchOrganization component with layout/CSS matching OrganizationsPage

"use client";

import { useState } from "react";
import { ArrowLeftRight, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetOrganizationsQuery } from "@/lib/services/superadmin/organizations";
import { showSuccess } from "@/lib/utils/toastHelpers";
import { Sidebar } from "@/components/superadmin/sidebar";
import { AppHeader } from "@/components/app-header";

export default function SwitchOrganization() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState("");

  const { data, isLoading } = useGetOrganizationsQuery({ page: 0, size: 200 });
  const organizations = data?.content || [];

  const handleApply = () => {
    if (!selectedOrg) return;

    const org = organizations.find((o) => o.publicId === selectedOrg);

    {
      org &&
        localStorage.setItem(
          "focusedOrganization",
          JSON.stringify({
            publicId: org.publicId,
            name: org.entityName,
            email: org.email,
            status: org.status,
          })
        );

      showSuccess(`Organization switched to ${org.entityName}`);
    }
    window.location.reload();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Layout */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <AppHeader
          title="Switch Organization"
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-white shadow-sm rounded-xl w-full max-w-3xl p-8 mx-auto">
            {/* Title */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-4 bg-blue-100 rounded-full">
                <ArrowLeftRight className="w-7 h-7 text-blue-700" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Switch Organization
              </h1>
            </div>

            {/* Dropdown */}
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Organization
            </label>

            {isLoading ? (
              <div className="animate-pulse w-full h-12 bg-gray-200 rounded-lg" />
            ) : (
              <select
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select --</option>
                {organizations.map((org) => (
                  <option key={org.publicId} value={org.publicId}>
                    {org.entityName} ({org.status})
                  </option>
                ))}
              </select>
            )}

            {/* Apply Button */}
            <button
              onClick={handleApply}
              disabled={!selectedOrg}
              className="mt-6 w-full py-3 rounded-lg text-white font-medium disabled:bg-gray-400"
              style={{
                background:
                  "linear-gradient(135deg, #FEA901 0%, #FD6E34 25%, #FE336A 75%, #FD401A 100%)",
              }}
            >
              Apply
            </button>

            {/* Current Focused Org */}
            <div className="mt-8 p-5 bg-gray-50 rounded-xl border">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Current Focused Organization
              </h3>
              <FocusedOrgInfo />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function FocusedOrgInfo() {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem("focusedOrganization");
  if (!stored)
    return <p className="text-gray-500 text-sm">None selected yet.</p>;

  const org = JSON.parse(stored);

  return (
    <div className="flex items-center space-x-3">
      <Building2 className="w-6 h-6 text-gray-700" />
      <div>
        <p className="font-semibold text-gray-800">{org.name}</p>
        <p className="text-sm text-gray-600">{org.email}</p>
      </div>
    </div>
  );
}
