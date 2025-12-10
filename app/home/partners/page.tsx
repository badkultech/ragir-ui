import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PartnerCard } from "@/components/homePage/shared/partner-card";
import { Header } from "@/components/homePage/sections/header";
import { Footer } from "@/components/homePage/sections/footer";

const partners = [
  { id: "the-lalit", name: "The Lalit", logo: "/tp-logo1.jpg" },
  { id: "aishwarya", name: "Aishwarya", logo: "/tp-logo2.png" },
  { id: "kaveri-grand", name: "Kaveri Grand", logo: "/tp-logo3.png" },
  { id: "golden-tulip", name: "Golden Tulip", logo: "/tp-logo4.png" },
  { id: "kamat", name: "Kamat", logo: "/tp-logo5.png" },
  { id: "radisson", name: "Radisson", logo: "/tp-logo6.png" },
  { id: "taj", name: "Taj Hotels", logo: "/tp-logo7.png" },
  { id: "tgi", name: "TGI", logo: "/tp-logo8.png" },
  { id: "leela", name: "The Leela", logo: "/tp-logo9.png" },
];

export default function PartnersPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header with back button */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/home"
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-barlow font-semibold italic  text-gray-900">
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
      <Footer />
    </>
  );
}
