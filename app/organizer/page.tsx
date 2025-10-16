"use client";

import { Sidebar } from "@/components/organizer/sidebar";
import { AppHeader } from "@/components/app-header";



export default function OrganizerPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <AppHeader title="Organizers" />
      </div>
    </div>
  );
}
