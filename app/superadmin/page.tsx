import { Plus } from "lucide-react";
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
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
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
        </main>
      </div>
    </div>
  );
}
