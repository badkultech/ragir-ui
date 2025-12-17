"use client"

import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import { TripLeaderCard } from "@/components/homePage/shared/trip-leader-card"
import { TripLeaderModal } from "@/components/homePage/shared/trip-leader-modal"
import { MainHeader } from "@/components/search-results/MainHeader"
import { useRouter } from "next/navigation"
import { menuItems, notificationsData, userMenuItems } from "../page"
import { SidebarMenu } from "@/components/search-results/SidebarMenu"

const tripLeaders = [
    {
        id: 1,
        name: "Kyle May",
        image: "/tl-pfp.jpg",
        organization: "Organisation Name",
        quote:
            "Adventure isn't just about reaching the summit—it's about the courage you build on the climb. Every step...",
    },
    {
        id: 2,
        name: "Kyle May",
        image: "/tl-pfp.jpg",
        organization: "Organisation Name",
        quote:
            "Adventure isn't just about reaching the summit—it's about the courage you build on the climb. Every step...",
    },
    {
        id: 3,
        name: "Kyle May",
        image: "/tl-pfp.jpg",
        organization: "Organisation Name",
        quote:
            "Adventure isn't just about reaching the summit—it's about the courage you build on the climb. Every step...",
    },
    {
        id: 4,
        name: "Kyle May",
        image: "/tl-pfp.jpg",
        organization: "Organisation Name",
        quote:
            "Adventure isn't just about reaching the summit—it's about the courage you build on the climb. Every step...",
    },
    {
        id: 5,
        name: "Kyle May",
        image: "/tl-pfp.jpg",
        organization: "Organisation Name",
        quote:
            "Adventure isn't just about reaching the summit—it's about the courage you build on the climb. Every step...",
    },
    {
        id: 6,
        name: "Kyle May",
        image: "/tl-pfp.jpg",
        organization: "Organisation Name",
        quote:
            "Adventure isn't just about reaching the summit—it's about the courage you build on the climb. Every step...",
    },
    {
        id: 7,
        name: "Kyle May",
        image: "/tl-pfp.jpg",
        organization: "Organisation Name",
        quote:
            "Adventure isn't just about reaching the summit—it's about the courage you build on the climb. Every step...",
    },
    {
        id: 8,
        name: "Kyle May",
        image: "/tl-pfp.jpg",
        organization: "Organisation Name",
        quote:
            "Adventure isn't just about reaching the summit—it's about the courage you build on the climb. Every step...",
    },
    {
        id: 9,
        name: "Kyle May",
        image: "/tl-pfp.jpg",
        organization: "Organisation Name",
        quote:
            "Adventure isn't just about reaching the summit—it's about the courage you build on the climb. Every step...",
    },
]

export default function TripLeadersPage() {
    const [selectedLeader, setSelectedLeader] = useState<(typeof tripLeaders)[0] | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const routes = useRouter()
    const [notifications, setNotifications] = useState(notificationsData);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleCardClick = (leader: (typeof tripLeaders)[0]) => {
        setSelectedLeader(leader)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedLeader(null)
    }

    return (
        <>
        <div className="min-h-screen bg-white">
            <MainHeader isLoggedIn={true}
            notifications={notifications}
            onUpdateNotifications={setNotifications}
            onMenuOpen={() => setSidebarOpen(true)}
            />
            {/* Header */}
            <div className="px-4 md:px-8 lg:px-16 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => routes.back()}>
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 italic">Trip Leaders</h1>
                </div>

                {/* Grid of cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tripLeaders.map((leader) => (
                        <TripLeaderCard
                            key={leader.id}
                            name={leader.name}
                            image={leader.image}
                            organization={leader.organization}
                            quote={leader.quote}
                            variant="grid"
                            onClick={() => handleCardClick(leader)}
                        />
                    ))}
                </div>
            </div>

            {/* Modal */}
            <TripLeaderModal isOpen={isModalOpen} onClose={handleCloseModal} leader={selectedLeader} />
        </div>
        <SidebarMenu
                    isOpen={isSidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    menuItems={menuItems}
                    userMenuItems={userMenuItems}
                  />
                  </>
    )
}
