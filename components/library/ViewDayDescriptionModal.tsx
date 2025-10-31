"use client";

import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { FullImageGalleryModal } from "./FullImageGalleryModal";

interface ViewDayDescriptionModalProps {
    open: boolean;
    onClose: () => void;
    data?: any;
}

export function ViewDayDescriptionModal({
    open,
    onClose,
    data,
}: ViewDayDescriptionModalProps) {

    const USE_LOCAL_FALLBACK = true; // 👈 toggle this to false when backend is ready

    const content = useMemo(() => {
        if (!USE_LOCAL_FALLBACK && data) return data;

        return {
            name: "Rajasthan Folk Festival",
            location: "Jodhpur, Rajasthan",
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

                            <div className="flex justify-between items-center text-gray-600 text-sm mt-4 w-full border-b-1 border-[#E4E4E4] border-t-1 py-3">
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
