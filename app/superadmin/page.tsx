"use client";

import { Plus, Building2, UserCheck, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@/components/superadmin/sidebar";
import { AppHeader } from "@/components/app-header";
import { useGetTenantStatsQuery } from "@/lib/services/superadmin";
import { useState } from "react";
import { AddCircle } from "@/components/common/AddCircle";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: tenantStatsData } = useGetTenantStatsQuery();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        <AppHeader title="Dashboard" onMenuClick={() => setSidebarOpen(true)} />

        {/* Main Content */}
        <main className="flex-1 p-4">
          <div className="max-w-7xl mx-auto grid gap-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/superadmin/admins">
                <div className="bg-white rounded-lg border p-4 shadow-sm flex flex-col items-center text-center hover:shadow-md transition">
                  <div className="p-2 bg-green-100 rounded-lg mb-2">
                    <UserCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {tenantStatsData?.activeAdmins ?? 0}
                  </h3>
                  <p className="text-gray-600 text-xs">Active Admins</p>
                </div>
              </Link>

              <Link href="/superadmin/admins">
                <div className="bg-white rounded-lg border p-4 shadow-sm flex flex-col items-center text-center hover:shadow-md transition">
                  <div className="p-2 bg-orange-100 rounded-lg mb-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {tenantStatsData?.pendingAdmins ?? 0}
                  </h3>
                  <p className="text-gray-600 text-xs">Pending Admins</p>
                </div>
              </Link>

              <Link href="/superadmin/organizer">
                <div className="bg-white rounded-lg border p-4 shadow-sm flex flex-col items-center text-center hover:shadow-md transition">
                  <div className="p-2 bg-blue-100 rounded-lg mb-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {tenantStatsData?.activeOrganizations ?? 0}
                  </h3>
                  <p className="text-gray-600 text-xs">Active Organizers</p>
                </div>
              </Link>

              <Link href="/superadmin/organizer">
                <div className="bg-white rounded-lg border p-4 shadow-sm flex flex-col items-center text-center hover:shadow-md transition">
                  <div className="p-2 bg-purple-100 rounded-lg mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {tenantStatsData?.pendingOrganizations ?? 0}
                  </h3>
                  <p className="text-gray-600 text-xs">Pending Organizers</p>
                </div>
              </Link>
            </div>

            {/* Add Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Add Admin */}
              <div className="bg-white rounded-lg border p-5 text-center shadow-sm hover:shadow-md transition">
                <div className="mb-4 flex justify-center">
                  <AddCircle href="/superadmin/add-admin" />
                </div>

                <h3 className="text-xl font-semibold mb-2">Add Admin</h3>
                <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                  Assign roles and grant secure access to your dashboard
                </p>

                <Link
                  href="/superadmin/add-admin"
                  className="inline-flex items-center justify-center px-6 py-2 rounded-full text-sm font-medium border shadow hover:shadow-md transition"
                  style={{
                    background:
                      "linear-gradient(135deg, #FEA901 0%, #FD6E34 25%, #FE336A 75%, #FD401A 100%)",
                    color: "white",
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Admin
                </Link>
              </div>

              {/* Add Organizer */}
              <div className="bg-white rounded-lg border p-5 text-center shadow-sm hover:shadow-md transition">
                <div className="mb-4 flex justify-center">
                  <AddCircle href="/superadmin/add-organizer" />
                </div>

                <h3 className="text-xl font-semibold mb-2">Add Organizer</h3>
                <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                  Manage event organizers and assign responsibilities
                </p>

                <Link
                  href="/superadmin/add-organizer"
                  className="inline-flex items-center justify-center px-6 py-2 rounded-full text-sm font-medium border shadow hover:shadow-md transition"
                  style={{
                    background:
                      "linear-gradient(135deg, #FEA901 0%, #FD6E34 25%, #FE336A 75%, #FD401A 100%)",
                    color: "white",
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Organizer
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
