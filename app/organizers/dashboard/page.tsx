"use client";

import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar} from "@/components/organizers/organizer-sidebar";
//
export default function OrganizerDashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <OrganizerSidebar />

      <div className="flex-1 flex flex-col">
        <AppHeader title="Create New Trip" />
        <main className="flex-1 p-6 md:p-8">
            <h1 className="text-2xl font-semibold mb-6">Create New Trip</h1>
        </main>
      </div>
    </div>
  );
}
