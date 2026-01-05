import { SectionHeader } from "@/components/homePage/shared/section-header";
import { RegionItem } from "@/components/homePage/shared/region-item";
import { Mountain, Sun, Palmtree, Building2, Plane, Ship } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const domesticRegions = [
  { name: "North India", icon: <Image src="/north-india-region.png" alt="North India" width={80} height={80} /> },
  { name: "South India", icon: <Image src="/south-india-region.png" alt="North India" width={80} height={80} /> },
  { name: "West India", icon: <Image src="/west-india-region.png" alt="North India" width={80} height={80} /> },
  { name: "Central India", icon: <Image src="/central-india-region.png" alt="North India" width={80} height={80} /> },
  { name: "East India", icon: <Image src="/east-india-region.png" alt="North India" width={80} height={80} /> },
  { name: "North-East India", icon: <Image src="/north-east-india-region.png" alt="North India" width={80} height={80} /> },
];

const internationalRegions = [
  { name: "South Asia", icon: <Image src="/south-asia-region.png" alt="North India" width={80} height={80} /> },
  { name: "South-East Asia", icon: <Image src="/south-east-asia-region.png" alt="North India" width={80} height={80} /> },
  { name: "East Asia", icon: <Image src="/east-asia-region.png" alt="North India" width={80} height={80} /> },
  { name: "Middle East", icon: <Image src="/middle-east-region.png" alt="North India" width={80} height={80} /> },
  { name: "Europe", icon: <Image src="/europe-region.png" alt="North India" width={80} height={80} /> },
  { name: "Africa", icon: <Image src="/africa-region.png" alt="North India" width={80} height={80} /> },
  { name: "North America", icon: <Image src="/north-america-region.png" alt="North India" width={80} height={80} /> },
  { name: "South America", icon: <Image src="/south-america-region.png" alt="North India" width={80} height={80} /> },
  { name: "Oceania", icon: <Image src="/oceania-region.png" alt="North India" width={80} height={80} /> },
];

export function RegionsSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 md:px-20">
        <SectionHeader
          title="Explore Regions"
          className="mb-10"
        />

        {/* Domestic */}
        <div className="mb-10">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Domestic
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {domesticRegions.map((region) => (
              <Link href={`/home/search-result-with-filter?destinationTags=${region.name}`}>
                <RegionItem
                  key={region.name}
                  name={region.name}
                  icon={region.icon}
                />
              </Link>
            ))}
          </div>
        </div>

        {/* International */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            International
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {internationalRegions.map((region) => (
              <Link href={`/home/search-result-with-filter?destinationTags=${region.name}`}>
                <RegionItem
                  key={region.name}
                  name={region.name}
                  icon={region.icon}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
