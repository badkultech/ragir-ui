import { useState } from "react";
import { MapPin } from "lucide-react";
import { formatTag } from "@/lib/utils/tagFormatter";
import { Card, CardContent } from "@/components/ui/card";

type TripCardProps = {
    image: string;
    name: string;
    tags?: string[]; // destinationTags array
    description?: string;
    leads?: number;
    queries?: number;
};

export function TripCard({
    image,
    name,
    tags = [],
    description,
    leads = 0,
    queries = 0,
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
                {/* Footer */}
                <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                    <div>
                        Leads <span className="font-semibold text-orange-500">{leads}</span>
                    </div>
                    <div>
                        Queries{" "}
                        <span className="font-semibold text-orange-500">{queries}</span>
                    </div>
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
