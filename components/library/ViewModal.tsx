"use client";

import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, HomeIcon, Clock, Car, Route, UtensilsCrossed, PersonStanding, DollarSign, Banknote } from "lucide-react";
import { useMemo, useState } from "react";
import { FullImageGalleryModal } from "./FullImageGalleryModal";
import Home from "@/app/prelaunch/page";
import { MealType } from "@/lib/services/organizer/trip/library/meal/types";

interface ViewModalProps {
    open: boolean;
    onClose: () => void;
    step: string;
    data?: any;
}

export function ViewModal({
    open,
    onClose,
    step, 
    data,
}: ViewModalProps) {

    const USE_LOCAL_FALLBACK = true; // 👈 toggle this to false when backend is ready

    const content = useMemo(() => {
        if (!USE_LOCAL_FALLBACK && data) return data;

        return {
            name: "Rajasthan Folk Festival",
            location: "Jodhpur | Jaipur | Udaipur",

            sharingType: "Single",
            from: "3:00 PM",
            to: "5:00 PM",

            vehicle: "Traveler Van | Train",
            departure: "Mumbai | 10:00 AM",
            arrival: "Goa | 2:00 PM",
            arrangement: "Self Arranged by Traveler",

            priceChargeMeal: "Included",
            mealType: "Breakfast",
            mealTime: "8:00 AM - 10:00 AM",

            moods: "Relaxed, Cultural, Adventure",
            priceChargeActivty: "Included",
            activtyTime: "10:00 AM - 12:00 PM",
            description:
                "Experience traditional music and dance performances by local artisans, showcasing the region’s rich heritage and storytelling. Participate in interactive cultural workshops where you can learn about folk instruments, local crafts, and traditional dance forms directly from the artists themselves.",
            documents: [
                { url: "/andaman-beach-scene.png" },
                { url: "/elegant-tea-logo.png" },
                { url: "/coorg-coffee-plantation.png" },
                { url: "/darjeeling-tea-gardens.png" },
                { url: "/andaman-beach-clear-water.png" },
                { url: "/elegant-tea-logo.png" },
            ],
            packingSuggestions: {
                clothing: [
                    "Comfortable and breathable outfits (cotton or linen for day events)",
                    "A light jacket or shawl for evening shows",
                ],
                footwear: [
                    "Comfortable sandals or shoes for workshops and exploring",
                    "Easy slip-on footwear for sacred spaces",
                ],
                accessories: [
                    "A hat or cap for outdoor activities",
                    "Sunscreen and sunglasses",
                    "A small crossbody bag to keep essentials hands-free",
                ],
            },
        };
    }, [data]);



    const [galleryOpen, setGalleryOpen] = useState(false);
    const gallery = content.documents || [];
    const mainImage = gallery[0]?.url;
    const smallImages = gallery.slice(1, 6);

    const returnStepContent = () => {
        switch (step) {
            case "day-description":
                return (
                   <>
                      <div className="flex justify-between items-center">
                                 <div className="flex items-center">
                                     <MapPin className="w-6 h-5 mr-2 text-gray-900" />
                                     <h3 className="text-base font-normal text-gray-800">
                                        Location
                                    </h3>
                                </div>
                               <div className="flex items-center">
                                    <h3 className="font-medium text-[14px] text-gray-900"> {content.location}</h3>
                               </div>
                      </div>
                   </>
                )
            case "stays":
                return (
                   <>   
                   <div className="flex justify-between items-center">
                                 <div className="flex items-center">
                                     <MapPin className="w-6 h-5 mr-2 text-gray-900" />
                                     <h3 className="text-base font-normal text-gray-800">
                                        Location
                                    </h3>
                                </div>
                               <div className="flex items-center">
                                    <h3 className="font-medium text-[14px] text-gray-900"> {content.location}</h3>
                               </div>
                      </div>
                      <div className="flex justify-between items-center">
                                 <div className="flex items-center">
                                     <HomeIcon className="w-6 h-5 mr-2 text-gray-900" />
                                     <h3 className="text-base font-normal text-gray-800">
                                        Type of Sharing
                                    </h3>
                                </div>
                               <div className="flex items-center">
                                    <h3 className="font-medium text-[14px] text-gray-900"> {content.sharingType}</h3>
                               </div>
                      </div>
                       <div className="flex justify-between items-center">
                                 <div className="flex items-center">
                                     <Clock className="w-6 h-5 mr-2 text-gray-900" />
                                     <h3 className="text-base font-normal text-gray-800">
                                        From
                                    </h3>
                                </div>
                               <div className="flex items-center">
                                    <h3 className="font-medium text-[14px] text-gray-900"> {content.from}</h3>
                               </div>
                      </div>
                       <div className="flex justify-between items-center">
                                 <div className="flex items-center">
                                     <Clock className="w-6 h-5 mr-2 text-gray-900" />
                                     <h3 className="text-base font-normal text-gray-800">
                                        To
                                    </h3>
                                </div>
                               <div className="flex items-center">
                                    <h3 className="font-medium text-[14px] text-gray-900"> {content.to}</h3>
                               </div>
                      </div>
                   </>
                );
                case "transit":
                return (
                   <>
                      <div className="flex justify-between items-center">
                                 <div className="flex items-center">
                                     <Car className="w-6 h-5 mr-2 text-gray-900" />
                                     <h3 className="text-base font-normal text-gray-800">
                                        Vehicle
                                    </h3>
                                </div>
                               <div className="flex items-center">
                                    <h3 className="font-medium text-[14px] text-gray-900"> {content.vehicle}</h3>
                               </div>
                      </div>
                       <div className="flex justify-between items-center">
                                 <div className="flex items-center">
                                     <Clock className="w-6 h-5 mr-2 text-gray-900" />
                                     <h3 className="text-base font-normal text-gray-800">
                                        Departure
                                    </h3>
                                </div>
                               <div className="flex items-center">
                                    <h3 className="font-medium text-[14px] text-gray-900"> {content.departure}</h3>
                               </div>
                      </div>
                       <div className="flex justify-between items-center">
                                 <div className="flex items-center">
                                     <Clock className="w-6 h-5 mr-2 text-gray-900" />
                                     <h3 className="text-base font-normal text-gray-800">
                                        Arrival
                                    </h3>
                                </div>
                               <div className="flex items-center">
                                    <h3 className="font-medium text-[14px] text-gray-900"> {content.arrival}</h3>
                               </div>
                      </div>
                      <div className="flex justify-between items-center">
                                 <div className="flex items-center">
                                     <Route className="w-6 h-5 mr-2 text-gray-900" />
                                     <h3 className="text-base font-normal text-gray-800">
                                        Mode of Arrangement
                                    </h3>
                                </div>
                               <div className="flex items-center">
                                    <h3 className="font-medium text-[14px] text-gray-900"> {content.arrangement}</h3>
                               </div>
                      </div>
                   </>
                );
                  case "meals":
                  return (
                   <>
                      <div className="flex justify-between items-center">
                                 <div className="flex items-center">
                                     <MapPin className="w-6 h-5 mr-2 text-gray-900" />
                                     <h3 className="text-base font-normal text-gray-800">
                                        Location
                                    </h3>
                                </div>
                               <div className="flex items-center">
                                    <h3 className="font-medium text-[14px] text-gray-900"> {content.location}</h3>
                               </div>
                      </div>
                       <div className="flex justify-between items-center">
                                 <div className="flex items-center">
                                     <UtensilsCrossed className="w-6 h-5 mr-2 text-gray-900" />
                                     <h3 className="text-base font-normal text-gray-800">
                                        Meal Type
                                    </h3>
                                </div>
                               <div className="flex items-center">
                                    <h3 className="font-medium text-[14px] text-gray-900"> {content.mealType}</h3>
                               </div>
                      </div>
                       <div className="flex justify-between items-center">
                                 <div className="flex items-center">
                                     <Banknote className="w-6 h-5 mr-2 text-gray-900" />
                                     <h3 className="text-base font-normal text-gray-800">
                                        Price Charge
                                    </h3>
                                </div>
                               <div className="flex items-center">
                                    <h3 className="font-medium text-[14px] text-gray-900"> {content.priceChargeMeal}</h3>
                               </div>
                      </div>
                      <div className="flex justify-between items-center">
                                 <div className="flex items-center">
                                     <Clock className="w-6 h-5 mr-2 text-gray-900" />
                                     <h3 className="text-base font-normal text-gray-800">
                                        Time
                                    </h3>
                                </div>
                               <div className="flex items-center">
                                    <h3 className="font-medium text-[14px] text-gray-900"> {content.Mealtime}</h3>
                               </div>
                      </div>
                   </>
                ); 
                case "activity" :
                     return (
                   <>
                     <div className="flex justify-between items-center">
                                 <div className="flex items-center">
                                     <PersonStanding className="w-6 h-5 mr-2 text-gray-900" />
                                     <h3 className="text-base font-normal text-gray-800">
                                        Moods
                                    </h3>
                                </div>
                               <div className="flex items-center">
                                    <h3 className="font-medium text-[14px] text-gray-900"> {content.moods}</h3>
                               </div>
                      </div>
                      <div className="flex justify-between items-center">
                                 <div className="flex items-center">
                                     <MapPin className="w-6 h-5 mr-2 text-gray-900" />
                                     <h3 className="text-base font-normal text-gray-800">
                                        Location
                                    </h3>
                                </div>
                               <div className="flex items-center">
                                    <h3 className="font-medium text-[14px] text-gray-900"> {content.location}</h3>
                               </div>
                      </div>
                     
                       <div className="flex justify-between items-center">
                                 <div className="flex items-center">
                                     <Banknote className="w-6 h-5 mr-2 text-gray-900" />
                                     <h3 className="text-base font-normal text-gray-800">
                                        Price Charge
                                    </h3>
                                </div>
                               <div className="flex items-center">
                                    <h3 className="font-medium text-[14px] text-gray-900"> {content.priceChargeActivty}</h3>
                               </div>
                      </div>
                      <div className="flex justify-between items-center">
                                 <div className="flex items-center">
                                     <Clock className="w-6 h-5 mr-2 text-gray-900" />
                                     <h3 className="text-base font-normal text-gray-800">
                                        Time
                                    </h3>
                                </div>
                               <div className="flex items-center">
                                    <h3 className="font-medium text-[14px] text-gray-900"> {content.activtyTime}</h3>
                               </div>
                      </div>
                   </>
                ); 
            default:
                return null;
        }}


    
    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent
                    className="w-[95vw] sm:w-[90vw] md:max-w-2xl lg:max-w-2xl p-0 overflow-hidden rounded-2xl"
                >

                    <div className="max-h-[90vh] overflow-y-auto px-4 py-3 font-barlow">

                         <DialogHeader>
                                <DialogTitle className="text-lg md:text-lg font-[600] text-gray-900 px-1 pb-3">
                                    {content.name}
                                </DialogTitle>
                            </DialogHeader>

                        {/* Hero Image */}
                        {mainImage ? (
                            <Image
                                src={mainImage}
                                alt={content.name}
                                width={800}
                                height={400}
                                className="w-full h-56 md:h-60 rounded-[12px] object-cover"
                            />
                        ) : (
                            <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-500">
                                No Image
                            </div>
                        )}

                        {/* Small Images Row */}
                        {smallImages.length > 0 && (
                            <div className="flex gap-2 mt-2 mb-2">
                                {smallImages.slice(0, 4).map((img: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="relative w-[80px] h-[60px] sm:w-[130px] sm:h-[110px] rounded-md overflow-hidden"
                                    >
                                        <Image
                                            src={img.url}
                                            alt={`Preview ${idx + 1}`}
                                            width={100}
                                            height={70}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                ))}

                                {/* "+N more" Overlay */}
                                {gallery.length > 5 && (
                                    <div
                                        onClick={() => {
                                            onClose();          // 👈 close outer modal
                                            setTimeout(() => setGalleryOpen(true), 200); // open inner after a short delay
                                        }}

                                        className="relative w-[80px] h-[60px] sm:w-[130px] sm:h-[110px] rounded-md overflow-hidden bg-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-400 transition"
                                    >
                                        <span className="text-gray-800 font-medium text-sm">
                                            +{gallery.length - 5} more
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Text Content */}
                        <div className="">
                              <p className="text-gray-700 text-[14px] mt-4 leading-relaxed">
                                {content.description}
                            </p>

                            <div className="flex justify-center flex-col text-gray-600 w-full gap-y-5 text-sm mt-4  border-b-1 border-[#E4E4E4] border-t-1 py-3">
                               {/* switch (step){
                                    case "day-description":
                                        return (
                                            <div className="flex items-center">
                               } */}

                               
                             {returnStepContent()}
                               
                               
                            </div>

                         

                            {/* Packing Suggestions */}
                            {content.packingSuggestions && (
                                <div className="mt-6">
                                    <h3 className="text-base font-semibold text-gray-900 mb-3">
                                        Packing Suggestions
                                    </h3>

                                    {Object.entries(content.packingSuggestions as Record<string, string[]>).map(
                                        ([key, list]) => (
                                            <div key={key} className="mb-4">
                                                <p className="font-medium text-gray-600 capitalize mb-1">
                                                    {key}
                                                </p>
                                                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                                                    {list.map((item, i) => (
                                                        <li key={i}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )
                                    )}

                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Fullscreen Gallery */}
            <FullImageGalleryModal
                open={galleryOpen}
                onClose={() => setGalleryOpen(false)}
                images={gallery}
                title={content.name}
            />
        </>
    );
}
