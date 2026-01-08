import { useState } from "react";
import { MapPin, MessageSquare, Users } from "lucide-react";
import { formatTag } from "@/lib/utils/tagFormatter";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

type TripCardProps = {
    image: string;
    name: string;
    tags?: string[]; // destinationTags array
    description?: string;
    leads?: number;
    queries?: number;
    tripPublicId: string;
};

export function TripCard({
    image,
    name,
    tags = [],
    description,
    leads = 0,
    queries = 0,
    tripPublicId,
}: TripCardProps) {
    const [showAllTags, setShowAllTags] = useState(false);

    const formattedTags = tags.map(formatTag);
    const visibleTags = formattedTags.slice(0, 2);
    const remainingCount = formattedTags.length - 2;

    return (
        <Card className="overflow-hidden rounded-xl hover:shadow-md transition relative">
            {/* Image */}
            <div className="h-44 w-full overflow-hidden">
                <img src={image} alt={name} className="h-full w-full object-cover" />
            </div>

            <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-base">{name}</h3>

                {/* Tags */}
                <div className="relative text-sm text-muted-foreground">
                    <div className="flex items-center gap-1 h-5 overflow-hidden">
                        <MapPin className="w-4 h-4 text-orange-500 shrink-0" />

                        {visibleTags.join(", ")}

                        {remainingCount > 0 && (
                            <span
                                onClick={() => setShowAllTags((v) => !v)}
                                className="ml-1 text-orange-500 cursor-pointer whitespace-nowrap"
                            >
                                +{remainingCount} more
                            </span>
                        )}
                    </div>

                    {/* Expanded tags overlay */}
                    {showAllTags && (
                        <div className="absolute left-5 top-full mt-1 z-20 bg-white shadow-md rounded-md px-2 py-1 text-sm max-w-[90%]">
                            {formattedTags.join(", ")}
                        </div>
                    )}
                </div>


                <div className="flex items-center justify-between gap-3 text-sm">
                    {/* Leads – LEFT */}
                    <Link href={`/organizer/leads/trip/${tripPublicId}`} className="flex-1">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer transition">
                            <Users className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-800">Leads</span>
                            <span className="font-semibold text-orange-500 ml-auto">
                                {leads}
                            </span>
                        </div>
                    </Link>

                    {/* Queries – RIGHT */}
                    <Link href={`/organizer/queries/trip/${tripPublicId}`} className="flex-1">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer transition">
                            <MessageSquare className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-800">Queries</span>
                            <span className="font-semibold text-orange-500 ml-auto">
                                {queries}
                            </span>
                        </div>
                    </Link>
                </div>


                {/* Description */}
                {description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {description}
                    </p>
                )}
            </CardContent>

        </Card>
    );
}
