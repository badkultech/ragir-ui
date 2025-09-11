import {
  Plus,
  Users,
  Building2,
  UserCheck,
  Clock,
  TrendingUp,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@/components/superadmin/sidebar";
import { Header } from "@/components/superadmin/header";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        <Header title="Dashboard" />

        {/* Main Content Area */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Active Admins */}
              <div className="bg-white rounded-lg shadow-sm border p-6 flex flex-col items-center text-center">
                <div className="p-2 bg-green-100 rounded-lg mb-4">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">24</h3>
                <p className="text-gray-600 text-sm">Active Admins</p>
              </div>

              {/* Pending Admins */}
              <div className="bg-white rounded-lg shadow-sm border p-6 flex flex-col items-center text-center">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">8</h3>
                <p className="text-gray-600 text-sm">Pending Admins</p>
              </div>

              {/* Active Organizations */}
              <div className="bg-white rounded-lg shadow-sm border p-6 flex flex-col items-center text-center">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">156</h3>
                <p className="text-gray-600 text-sm">Active Organizers</p>
              </div>

              {/* Pending Organizations */}
              <div className="bg-white rounded-lg shadow-sm border p-6 flex flex-col items-center text-center">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">23</h3>
                <p className="text-gray-600 text-sm">Pending Organizers</p>
              </div>
            </div>
            {/* Add Sections Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Add Admin Section */}
              <div className="bg-white rounded-lg shadow-sm border p-8">
                <div className="text-center max-w-md mx-auto">
                  {/* Add Admin Icon */}
                  <div className="mb-6 flex justify-center">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                        <Link href="/superadmin/add-admin">
                          <Plus className="w-4 h-4 text-white" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    Add Admin
                  </h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Assign roles and grant secure access to your dashboard
                  </p>

                  <Link
                    href="/superadmin/add-admin"
                    className="inline-flex items-center justify-center px-8 py-3 rounded-full font-medium border-2 border-white shadow-lg text-gray-900 hover:shadow-xl transition-shadow"
                    style={{
                      background:
                        "linear-gradient(135deg, #FEA901 0%, #FD6E34 25%, #FE336A 75%, #FD401A 100%)",
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Admin
                  </Link>
                </div>
              </div>

              {/* Add Organizer Section */}
              <div className="bg-white rounded-lg shadow-sm border p-8">
                <div className="text-center max-w-md mx-auto">
                  {/* Add Organizer Icon */}
                  <div className="mb-6 flex justify-center">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                        <Link href="/superadmin/add-organizer">
                          <Plus className="w-4 h-4 text-white" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    Add Organizer
                  </h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Manage event organizers and assign responsibilities
                  </p>

                  <Link
                    href="/superadmin/add-organizer"
                    className="inline-flex items-center justify-center px-8 py-3 rounded-full font-medium border-2 border-white shadow-lg text-gray-900 hover:shadow-xl transition-shadow"
                    style={{
                      background:
                        "linear-gradient(135deg, #FEA901 0%, #FD6E34 25%, #FE336A 75%, #FD401A 100%)",
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Organizer
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
