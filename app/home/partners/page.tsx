import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PartnerCard } from "@/components/homePage/shared/partner-card";

const partners = [
  { id: "the-lalit", name: "The Lalit", logo: "/the-lalit-hotel-logo.jpg" },
  { id: "radisson", name: "Radisson", logo: "/radisson-hotel-logo.jpg" },
  { id: "marriott", name: "Marriott", logo: "/marriott-hotel-logo.jpg" },
  { id: "hilton", name: "Hilton", logo: "/hilton-hotel-logo.jpg" },
  { id: "hyatt", name: "Hyatt", logo: "/hyatt-hotel-logo.jpg" },
  { id: "itc", name: "ITC Hotels", logo: "/itc-hotels-logo.png" },
  { id: "taj", name: "Taj Hotels", logo: "/taj-hotels-logo.png" },
  { id: "oberoi", name: "Oberoi", logo: "/oberoi-hotel-logo.jpg" },
  { id: "leela", name: "The Leela", logo: "/the-leela-hotel-logo.jpg" },
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-serif italic text-gray-900">
            Our Trusted Partners
          </h1>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map((partner) => (
            <PartnerCard
              key={partner.id}
              id={partner.id}
              name={partner.name}
              logo={partner.logo}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
