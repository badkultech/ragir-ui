"use client";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Bell,
  MapPin,
  UsersRound,
  MessageSquare,
  FileStack,
} from "lucide-react";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { AppHeader } from "@/components/app-header";
import { LibraryIcon } from "@/components/library/SvgComponents/Icons";
import { CreateTripModal } from "@/components/trip/CreateTripModal";
import Link from "next/link";

export default function DashboardMainContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const activities = [
    { message: 'Sarah joined “Himalayan Adventure”', time: "2 hours ago" },
    { message: "Desert Safari Expedition started", time: "5 hours ago" },
    { message: "Added 3 new Activity items", time: "1 day ago" },
    { message: "Desert Safari Expedition started", time: "5 hours ago" },
  ];

  const trips = [
    {
      name: "Rajasthan Folk Festival",
      location: "Jodhpur, Rajasthan",
      image: "/images/trip1.jpg",
      description:
        "Traditional music and dance performances with local artisans and cultural workshops",
    },
    {
      name: "Rajasthan Folk Festival",
      location: "Jodhpur, Rajasthan",
      image: "/images/trip2.jpg",
      description:
        "Traditional music and dance performances with local artisans and cultural workshops",
    },
    {
      name: "Rajasthan Folk Festival",
      location: "Jodhpur, Rajasthan",
      image: "/images/trip3.jpg",
      description:
        "Traditional music and dance performances with local artisans and cultural workshops",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="Dashboard" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Top 4 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Create Trip Card */}
            <Card className="bg-orange-500 text-white hover:bg-orange-600 transition cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center h-32 space-y-2"
                onClick={() => setOpenModal(true)}>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg">Create New Trip</h3>
                <p className="text-sm font-semibold items-right justify-right">
                  Start from scratch or use template
                </p>
              </CardContent>
            </Card>

            {/* All Leads */}
             <Link href="/organizer/leads/all">
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-32 space-y-2">
                <div className="bg-gray-100 p-2 rounded-full">
                  <UsersRound className="w-5 h-5 text-gray-700" />
                </div>
                <p className="text-sm text-muted-foreground">All Leads</p>
                <h2 className="text-2xl font-bold">24</h2>
              </CardContent>
            </Card>
            </Link>

            {/* All Queries */}
            <Link href="/organizer/queries/all">
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-32 space-y-2">
                <div className="bg-gray-100 p-2 rounded-full">
                  <MessageSquare className="w-5 h-5 text-gray-700" />
                </div>
                <p className="text-sm text-muted-foreground">All Queries</p>
                <h2 className="text-2xl font-bold">42</h2>
              </CardContent>
            </Card>
            </Link>

            {/* Library */}
            <Link href="/organizer/library">
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-32 space-y-3">
                  <div className="bg-gray-100 p-4 rounded-full">
                    <LibraryIcon width="5" height="5" />
                  </div>
                  <p className="text-sm text-muted-foreground">Library</p>
                  <h2 className="text-2xl font-bold"></h2>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex items-center justify-between border-b pb-2">
              <CardTitle>Recent Activity</CardTitle>
              <Link href="/organizer/trips/activities">
              <Button
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
              >
                View All
              </Button>
              </Link>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4 pt-4">
              {activities.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-white border rounded-full p-1">
                      <Bell className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* This Month Trips */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">This Month</h2>
              <Link href="/organizer/trips" className="">
              <Button
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
              >
                View All
              </Button>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trips.map((trip, i) => (
                <Card
                  key={i}
                  className="hover:shadow-md transition overflow-hidden"
                >
                  <img
                    src={trip.image}
                    alt={trip.name}
                    className="h-40 w-full object-cover"
                  />
                  <CardContent className="p-4 space-y-1">
                    <h3 className="font-semibold text-lg">{trip.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      {trip.location}
                    </div>
                    <p className="text-sm text-gray-600">
                      {trip.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* November Trips */}
          <section>
            <h2 className="text-lg font-semibold mb-3">November, 2025</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trips.map((trip, i) => (
                <Card
                  key={i}
                  className="hover:shadow-md transition overflow-hidden"
                >
                  <img
                    src={trip.image}
                    alt={trip.name}
                    className="h-40 w-full object-cover"
                  />
                  <CardContent className="p-4 space-y-1">
                    <h3 className="font-semibold text-lg">{trip.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      {trip.location}
                    </div>
                    <p className="text-sm text-gray-600">
                      {trip.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </main>
      </div >
      {/* Create Trip Modal */}
      < CreateTripModal
        open={openModal}
        onClose={() => setOpenModal(false)
        }
        onStartFromScratch={() => console.log("New trip")}
        onUseSimilarTrip={() => console.log("Use similar trip")}
      />
    </div >
  );
}
