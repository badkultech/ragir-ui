import { SectionHeader } from "@/components/homePage/shared/section-header";
import { RegionItem } from "@/components/homePage/shared/region-item";
import { Mountain, Sun, Palmtree, Building2, Plane, Ship } from "lucide-react";

const domesticRegions = [
  { name: "North India", icon: <Mountain className="w-5 h-5" /> },
  { name: "South India", icon: <Palmtree className="w-5 h-5" /> },
  { name: "West India", icon: <Sun className="w-5 h-5" /> },
  { name: "Central India", icon: <Building2 className="w-5 h-5" /> },
  { name: "East India", icon: <Ship className="w-5 h-5" /> },
  { name: "North-East India", icon: <Mountain className="w-5 h-5" /> },
];

const internationalRegions = [
  { name: "South Asia", icon: <Plane className="w-5 h-5" /> },
  { name: "South-East Asia", icon: <Palmtree className="w-5 h-5" /> },
  { name: "East Asia", icon: <Building2 className="w-5 h-5" /> },
  { name: "Middle East", icon: <Sun className="w-5 h-5" /> },
  { name: "Europe", icon: <Building2 className="w-5 h-5" /> },
  { name: "Africa", icon: <Sun className="w-5 h-5" /> },
  { name: "North America", icon: <Building2 className="w-5 h-5" /> },
  { name: "South America", icon: <Palmtree className="w-5 h-5" /> },
  { name: "Oceania", icon: <Ship className="w-5 h-5" /> },
];

export function RegionsSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Explore Regions"
          viewAllHref="/regions"
          className="mb-10"
        />

        {/* Domestic */}
        <div className="mb-10">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Domestic
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {domesticRegions.map((region) => (
              <RegionItem
                key={region.name}
                name={region.name}
                icon={region.icon}
              />
            ))}
          </div>
        </div>

        {/* International */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            International
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {internationalRegions.map((region) => (
              <RegionItem
                key={region.name}
                name={region.name}
                icon={region.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
