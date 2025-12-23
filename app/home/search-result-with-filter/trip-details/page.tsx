"use client"

import { useState } from "react"
import Image from "next/image"
import { MainHeader } from "@/components/search-results/MainHeader"
import { Footer } from "@/components/homePage/sections/footer"
import { BookingSidebar } from "@/components/trip-details/booking-sidebar"
import { OrganizerProfileModal } from "@/components/trip-details/organizer-profile-modal"
import { ReportTripModal } from "@/components/trip-details/report-trip-modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
    MapPin,
    Calendar,
    Users,
    Mountain,
    Share2,
    Heart,
    Clock,
    Navigation,
    Utensils,
    X,
    Check,
    Flag,
    Home,
    Bike,
} from "lucide-react"

export default function TripDetailsPage() {
    const [selectedImage, setSelectedImage] = useState(0)

    const images = [
        "/himalayan-mountains-landscape-with-snow-peaks-and-.jpg",
        "/mountain-trail-hiking-path-with-person.jpg",
        "/green-valley-landscape-himalayan.jpg",
        "/mountain-lake-reflection-blue-water.jpg",
        "/camping-tent-mountains-sunset.jpg",
    ]

    return (
        <div className="min-h-screen flex flex-col bg-[#e4e4e4]">
            <MainHeader />

            <main className="flex-1 max-w-[1200px] mx-auto  ">
                <section className="container px-4 py-6 md:px-6">
                    <div className="grid gap-2 grid-cols-1 md:grid-cols-3 h-[400px] md:h-[500px]">
                        {/* Large image - spans 2 columns */}
                        <div className="relative md:col-span-2 rounded-xl overflow-hidden">
                            <Image
                                src={images[0] || "/placeholder.svg"}
                                alt="Main trip image"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Small images grid - spans 1 column, arranged as 2x2 grid */}
                        <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2">
                            {images.slice(1, 5).map((img, idx) => (
                                <div key={idx} className="relative rounded-xl overflow-hidden">
                                    <Image src={img || "/placeholder.svg"} alt={`Trip image ${idx + 2}`} fill className="object-cover" />
                                    {idx === 3 && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <span className="text-white font-semibold">+5 more</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Content - Full width matching the gallery above */}
                <section className="container px-4 md:px-6 ">
                    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                        {/* Main Content */}
                        <div className="space-y-8 bg-white p-3 rounded-xl">
                            {/* Header */}
                            <div className="space-y-4">
                                {/* Badges */}
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="rounded-full">
                                        <Mountain className="size-3 mr-1" />
                                        Mountain
                                    </Badge>
                                    <Badge variant="secondary" className="rounded-full">
                                        <Users className="size-3 mr-1" />
                                        Trekking
                                    </Badge>
                                    <Badge variant="secondary" className="rounded-full">
                                        Beach
                                    </Badge>
                                    <Badge variant="secondary" className="rounded-full">
                                        Desert
                                    </Badge>
                                </div>

                                {/* Title and actions */}
                                <div className="flex items-start justify-between gap-4">
                                    <h1 className="text-3xl md:text-4xl font-bold text-balance leading-tight">
                                        Himachal Backpacking: Manali, Kasol & Jibhi
                                    </h1>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button variant="ghost" size="icon" className="rounded-full">
                                            <Heart className="size-5" />
                                            <span className="sr-only">Save trip</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="rounded-full">
                                            <Share2 className="size-5" />
                                            <span className="sr-only">Share trip</span>
                                        </Button>
                                        <ReportTripModal>
                                            <Button variant="ghost" size="icon" className="rounded-full">
                                                <Flag className="size-5" />
                                                <span className="sr-only">Report trip</span>
                                            </Button>
                                        </ReportTripModal>
                                    </div>
                                </div>

                                {/* Organizers */}
                                <div className="flex items-center gap-4">
                                    <OrganizerProfileModal
                                        name="Arjun Sharma"
                                        role="Adventure Specialist"
                                        avatarUrl="/male-mountain-guide-portrait.jpg"
                                        bio="Raj is an experienced mountain guide with 12 years of trekking experience across the Himalayas. He specializes in high-altitude expeditions and has successfully guided over 500 trekkers. His expertise includes altitude acclimatization, weather prediction, and route planning. He is certified by the International Mountain Guide Association and is passionate about sustainable tourism."
                                        stats={{
                                            experience: "8 years leading Himalayan trips",
                                            tripsLed: "150+ trips led",
                                        }}
                                    >
                                        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                            <Avatar className="size-10">
                                                <AvatarImage src="/male-guide-portrait.jpg" alt="Mountain Trails" />
                                                <AvatarFallback>MT</AvatarFallback>
                                            </Avatar>
                                            <div className="text-left">
                                                <p className="text-sm font-medium">Mountain Trails</p>
                                                <p className="text-xs text-muted-foreground">More Details →</p>
                                            </div>
                                        </button>
                                    </OrganizerProfileModal>

                                    <OrganizerProfileModal
                                        name="Arjun Mehta"
                                        role="Mountain Guide"
                                        avatarUrl="/male-adventure-guide-portrait.jpg"
                                        bio="Arjun Mehta is a certified mountain guide and wildlife enthusiast with extensive knowledge of Himalayan ecosystems. Over the past 10 years, he has led expeditions ranging from beginner treks to advanced mountaineering courses. His calm demeanor and attention to safety have made him a favorite among trekkers. Arjun is also a trained wilderness first responder and has helped rescue teams in emergency situations."
                                        stats={{
                                            experience: "10 years mountain guiding",
                                            tripsLed: "200+ successful expeditions",
                                        }}
                                    >
                                        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                            <Avatar className="size-10">
                                                <AvatarImage src="/male-adventure-guide.jpg" alt="Arjun Mehta" />
                                                <AvatarFallback>AM</AvatarFallback>
                                            </Avatar>
                                            <div className="text-left">
                                                <p className="text-sm font-medium">Arjun Mehta</p>
                                                <p className="text-xs text-muted-foreground">View Profile →</p>
                                            </div>
                                        </button>
                                    </OrganizerProfileModal>
                                </div>
                            </div>

                            {/* Trip Meta Info */}
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 p-4 rounded-xl border bg-card">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center size-10 rounded-full bg-muted">
                                        <MapPin className="size-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">From</p>
                                        <p className="font-medium">Delhi → Delhi</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center size-10 rounded-full bg-muted">
                                        <Calendar className="size-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Duration</p>
                                        <p className="font-medium">15 Dec, 2025 - 22 Dec, 2025</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center size-10 rounded-full bg-muted">
                                        <Users className="size-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Group Size</p>
                                        <p className="font-medium">10-20 years</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center size-10 rounded-full bg-muted">
                                        <Mountain className="size-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Activities</p>
                                        <p className="font-medium">6-30</p>
                                    </div>
                                </div>
                            </div>

                            {/* Trip Highlights */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold">Trip Highlights</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Experience the majestic Himalayas with thrilling adventures, serene landscapes, and cultural
                                    immersion. Visit ancient temples, try adventure sports, and connect with fellow travelers. Enjoy
                                    pristine mountains, lush valleys, and much more. This is a comprehensive experience designed to
                                    immerse you in nature, provide thrilling adventures, and explore the rich culture of the Himalayan
                                    region with experts.
                                </p>
                            </div>

                            {/* Day Wise Itinerary */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold">Day Wise Itinerary</h2>
                                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                                        <Clock className="size-4" />
                                        View Full Itinerary
                                    </Button>
                                </div>

                                <Tabs defaultValue="day1" className="w-full">
                                    <TabsList className="w-full justify-start overflow-x-auto">
                                        <TabsTrigger value="day1" className="rounded-full">
                                            Day 1
                                        </TabsTrigger>
                                        <TabsTrigger value="day2" className="rounded-full">
                                            Day 2
                                        </TabsTrigger>
                                        <TabsTrigger value="day3" className="rounded-full">
                                            Day 3
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="day1" className="space-y-4 mt-6">
                                        <div className="p-6 rounded-xl border bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
                                            <h3 className="text-xl font-semibold mb-2">Day 1: Delhi to Manali</h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                Begin your adventure with an overnight AC Volvo bus journey from Delhi to Manali. Brace through
                                                the mountains! While journeying, catch a mesmerizing view. Check into your hotel/guesthouse upon
                                                arrival. Explore the local cafes, try local dishes, witness local artisans perform their craft,
                                                and enjoy the beauty of snow-capped mountains. Enjoy the beautiful sights and relax along the
                                                highway.
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Breakfast */}
                                            <div className="flex items-start gap-4 p-4 rounded-lg border">
                                                <div className="flex items-center justify-center size-12 rounded-full bg-muted shrink-0">
                                                    <Utensils className="size-5 text-muted-foreground" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="font-semibold">Breakfast Included</h4>
                                                        <Badge variant="outline" className="text-xs">
                                                            Hotel Restaurant
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Continental breakfast served at the hotel with fresh local ingredients, tea/coffee, and
                                                        seasonal fruits
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="size-3" />8 AM - 10 AM
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Dinner */}
                                            <div className="flex items-start gap-4 p-4 rounded-lg border">
                                                <div className="flex items-center justify-center size-12 rounded-full bg-muted shrink-0">
                                                    <Utensils className="size-5 text-muted-foreground" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="font-semibold">Dinner at Local Restaurant</h4>
                                                        <Badge variant="outline" className="text-xs">
                                                            Indian/Tibel
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Authentic Himachali cuisine featuring Dal Makhni, Momos, and Churro Madua with traditional
                                                        accompaniments
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="size-3" />
                                                            7:30 PM - 9:30 PM
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Navigation className="size-3" />
                                                            Manali MMT Food
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Volvo Ride */}
                                            <div className="flex items-start gap-4 p-4 rounded-lg border">
                                                <div className="flex items-center justify-center size-12 rounded-full bg-muted shrink-0">
                                                    <MapPin className="size-5 text-muted-foreground" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="font-semibold">Volvo Bus - Delhi to Manali</h4>
                                                        <Badge variant="outline" className="text-xs">
                                                            Overnight Journey
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Overnight semi-sleeper AC bus with comfortable reclining seats, blankets, and regular
                                                        comfort stops along the highway
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="size-3" />
                                                            10-14 hours journey
                                                        </span>
                                                        <span>Departure 6:00 PM from Delhi</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Evening Walk */}
                                            <div className="flex items-start gap-4 p-4 rounded-lg border">
                                                <div className="flex items-center justify-center size-12 rounded-full bg-muted shrink-0">
                                                    <Navigation className="size-5 text-muted-foreground" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="font-semibold">Evening Exploration & Acclimatization Walk</h4>
                                                        <Badge variant="outline" className="text-xs">
                                                            Free Time/Self-based
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Guided walking tour of Old Manali covering Hadimba Temple, Buddhist monasteries, local
                                                        markets offering handicrafts, and scenic viewpoints with affiliate accommodation
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="size-3" />3 hours
                                                        </span>
                                                        <span>Easy walk</span>
                                                        <span>Optional activity</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="day2" className="mt-6">
                                        <div className="p-6 rounded-xl border bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
                                            <h3 className="text-xl font-semibold mb-2">Day 2: Manali Local Sightseeing</h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                Explore the beautiful Manali with visits to Hadimba Temple, Vashisht Hot Springs, and local
                                                markets. Enjoy adventure activities like paragliding or zorbing if interested.
                                            </p>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="day3" className="mt-6">
                                        <div className="p-6 rounded-xl border bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
                                            <h3 className="text-xl font-semibold mb-2">Day 3: Manali to Kasol</h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                Journey to Kasol through scenic mountain roads. Check into your riverside accommodation and
                                                explore the local cafes and beautiful Parvati Valley.
                                            </p>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold">What's Included</h2>

                                <Tabs defaultValue="transfers" className="w-full">
                                    <TabsList className="w-full justify-start overflow-x-auto bg-muted/50">
                                        <TabsTrigger value="transfers" className="gap-2">
                                            <Bike className="size-4" />
                                            Transfers
                                        </TabsTrigger>
                                        <TabsTrigger value="meals" className="gap-2">
                                            <Utensils className="size-4" />
                                            Meals
                                        </TabsTrigger>
                                        <TabsTrigger value="stays" className="gap-2">
                                            <Home className="size-4" />
                                            Stays
                                        </TabsTrigger>
                                        <TabsTrigger value="activities" className="gap-2">
                                            <Mountain className="size-4" />
                                            Activities
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="transfers" className="space-y-3 mt-6">
                                        <p className="text-sm text-muted-foreground mb-4">Total 4 Modes Included</p>

                                        {/* AC Volvo Bus */}
                                        <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                                            <div className="flex items-center justify-center size-10 rounded-full bg-muted shrink-0 mt-1">
                                                <Bike className="size-5 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold mb-1">AC Volvo Bus</h4>
                                                <p className="text-sm text-muted-foreground">Delhi to Manali and return</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Calendar className="size-4 text-muted-foreground" />
                                                    <span className="text-muted-foreground">5 Dec - 22 Dec 2025</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tempo Traveler */}
                                        <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                                            <div className="flex items-center justify-center size-10 rounded-full bg-muted shrink-0 mt-1">
                                                <Bike className="size-5 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold mb-1">Tempo Traveler</h4>
                                                <p className="text-sm text-muted-foreground">All local sightseeing and transfers</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Calendar className="size-4 text-muted-foreground" />
                                                    <span className="text-muted-foreground">6 Dec - 21 Dec 2025</span>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="meals" className="space-y-3 mt-6">
                                        <p className="text-sm text-muted-foreground mb-4">Total 14 Meals Included</p>

                                        {/* Breakfast */}
                                        <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                                            <div className="flex items-center justify-center size-10 rounded-full bg-muted shrink-0 mt-1">
                                                <Check className="size-5 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold mb-1">Breakfast Included</h4>
                                                <p className="text-sm text-muted-foreground">8 meals included</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Calendar className="size-4 text-muted-foreground" />
                                                    <span className="text-muted-foreground">16-21 Dec 2025 (6 meals)</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dinner */}
                                        <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                                            <div className="flex items-center justify-center size-10 rounded-full bg-muted shrink-0 mt-1">
                                                <Check className="size-5 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold mb-1">Dinner</h4>
                                                <p className="text-sm text-muted-foreground">6 meals included</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Calendar className="size-4 text-muted-foreground" />
                                                    <span className="text-muted-foreground">18, 19 Dec 2025 (3 meals)</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dietary Options */}
                                        <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                                            <div className="flex items-center justify-center size-10 rounded-full bg-muted shrink-0 mt-1">
                                                <Utensils className="size-5 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold mb-1">Dietary Options</h4>
                                                <p className="text-sm text-muted-foreground">Veg & Non-veg available</p>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="stays" className="space-y-3 mt-6">
                                        <p className="text-sm text-muted-foreground mb-4">Total 6 Nights Accommodation</p>

                                        <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                                            <div className="flex items-center justify-center size-10 rounded-full bg-muted shrink-0 mt-1">
                                                <Home className="size-5 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold mb-1">Hotels & Guesthouses</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Comfortable accommodation in Manali, Kasol, and Jibhi
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Calendar className="size-4 text-muted-foreground" />
                                                    <span className="text-muted-foreground">6 nights</span>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="activities" className="space-y-3 mt-6">
                                        <p className="text-sm text-muted-foreground mb-4">Multiple Activities Included</p>

                                        <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                                            <div className="flex items-center justify-center size-10 rounded-full bg-muted shrink-0 mt-1">
                                                <Mountain className="size-5 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold mb-1">Trekking & Sightseeing</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Guided treks, temple visits, and local exploration
                                                </p>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>

                            {/* What's Excluded */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold">What's Excluded</h2>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                                        <div className="flex items-center justify-center size-8 rounded-full bg-destructive/10 shrink-0">
                                            <X className="size-4 text-destructive" />
                                        </div>
                                        <span className="text-sm">Personal Expenses</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                                        <div className="flex items-center justify-center size-8 rounded-full bg-destructive/10 shrink-0">
                                            <X className="size-4 text-destructive" />
                                        </div>
                                        <span className="text-sm">Visa and Passport Fees</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                                        <div className="flex items-center justify-center size-8 rounded-full bg-destructive/10 shrink-0">
                                            <X className="size-4 text-destructive" />
                                        </div>
                                        <span className="text-sm">Meals Not Listed</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                                        <div className="flex items-center justify-center size-8 rounded-full bg-destructive/10 shrink-0">
                                            <X className="size-4 text-destructive" />
                                        </div>
                                        <span className="text-sm">Travel Insurance</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                                        <div className="flex items-center justify-center size-8 rounded-full bg-destructive/10 shrink-0">
                                            <X className="size-4 text-destructive" />
                                        </div>
                                        <span className="text-sm">Tips and Gratuities</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                                        <div className="flex items-center justify-center size-8 rounded-full bg-destructive/10 shrink-0">
                                            <X className="size-4 text-destructive" />
                                        </div>
                                        <span className="text-sm">Adventure Activities at your own cost</span>
                                    </div>
                                </div>
                            </div>

                            {/* What's Not Included */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold">What's Not Included</h2>

                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>What's included in the trip?</AccordionTrigger>
                                        <AccordionContent>
                                            <p className="text-muted-foreground">
                                                AC Volvo transportation, all accommodations, specified meals (8 breakfasts), experienced Trip
                                                Captain, sightseeing tours, and basic trekking equipment.
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-2">
                                        <AccordionTrigger>What are the cancellation policy?</AccordionTrigger>
                                        <AccordionContent>
                                            <p className="text-muted-foreground">
                                                Cancellations made 30+ days before departure receive 80% refund, 15-30 days receive 50% refund,
                                                and less than 15 days are non-refundable. Medical emergencies are reviewed case-by-case.
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-3">
                                        <AccordionTrigger>What fitness level is required?</AccordionTrigger>
                                        <AccordionContent>
                                            <p className="text-muted-foreground">
                                                Moderate fitness level required. You should be able to walk 4-5 hours with breaks and handle
                                                moderate altitude. Prior trekking experience is helpful but not mandatory.
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-4">
                                        <AccordionTrigger>Is phone network available?</AccordionTrigger>
                                        <AccordionContent>
                                            <p className="text-muted-foreground">
                                                Network availability varies. BSNL and Jio work best in most areas. Some remote locations may
                                                have limited or no connectivity. We recommend informing family before departure.
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-5">
                                        <AccordionTrigger>What about safety measures?</AccordionTrigger>
                                        <AccordionContent>
                                            <p className="text-muted-foreground">
                                                All guides are certified first-aid responders. We carry emergency medical kits, oxygen
                                                cylinders, and have 24/7 support. Regular health checks are conducted during high-altitude
                                                sections.
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>

                            {/* Report this trip button - mobile */}
                            <div className="lg:hidden">
                                <ReportTripModal>
                                    <Button variant="outline" className="w-full gap-2 bg-transparent">
                                        <Flag className="size-4" />
                                        Report this trip
                                    </Button>
                                </ReportTripModal>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:sticky lg:top-20 lg:self-start">
                            <BookingSidebar />
                        </div>
                    </div>
                </section>

                {/* Mobile Booking Bar */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-background border-t">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <div className="text-2xl font-bold">₹47,000</div>
                            <div className="text-sm text-muted-foreground">per person</div>
                        </div>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Request invite</Button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
