"use client";

import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OrganizerProfileEmptyPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <OrganizerSidebar />

      <div className="flex-1 flex flex-col">
        <AppHeader title="Organizer Profile" />

        <main className="flex-1 p-6 md:p-8 flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-semibold mb-2">Complete Your Profile</h1>
          <p className="text-gray-500 mb-6 max-w-md">
            Add your details to showcase your identity and manage your events
            seamlessly.
          </p>
          <Link href="/organizer/profile/edit">
            <Button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
              Add Details +
            </Button>
          </Link>
        </main>
      </div>
    </div>
  );
}
