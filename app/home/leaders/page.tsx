"use client"

import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import { TripLeaderCard } from "@/components/homePage/shared/trip-leader-card"
import { TripLeaderModal } from "@/components/homePage/shared/trip-leader-modal"
import { MainHeader } from "@/components/search-results/MainHeader"
import { useRouter } from "next/navigation"
import { menuItems, notificationsData, userMenuItems } from "../constants";

import { SidebarMenu } from "@/components/search-results/SidebarMenu"
import { useSelector, useDispatch } from "react-redux"
import { logout, selectAuthState } from "@/lib/slices/auth"

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
    const dispatch = useDispatch()
    const router = useRouter()
    const [notifications, setNotifications] = useState(notificationsData);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { accessToken, userData } = useSelector(selectAuthState);
    const isLoggedIn = Boolean(accessToken && userData);

    const handleLogout = () => {
        localStorage.clear();
        dispatch(logout());
        setIsSidebarOpen(false);
        router.push("/home");
    };

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
                <MainHeader isLoggedIn={isLoggedIn}
                    notifications={notifications}
                    onUpdateNotifications={setNotifications}
                    onMenuOpen={() => setIsSidebarOpen(true)}
                />
                {/* Header */}
                <div className="px-4 md:px-8 lg:px-16 py-8">
                    <div className="flex items-center gap-4 mb-8">
                        <button onClick={() => router.back()}>
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
                onClose={() => setIsSidebarOpen(false)}
                menuItems={menuItems}
                userMenuItems={userMenuItems}
                onLogout={handleLogout}
                isLoggedIn={isLoggedIn}
            />
        </>
    )
}
