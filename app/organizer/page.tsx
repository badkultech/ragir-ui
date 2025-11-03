"use client";

import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { useState } from "react";



export default function OrganizerPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-gray-50">
       {/* Sidebar */}
            <OrganizerSidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
      <div className="flex-1">
       <AppHeader title="Organizers" onMenuClick={() => setSidebarOpen(true)} />
      </div>
    </div>
  );
}
