import { SectionHeader } from "@/components/homePage/shared/section-header";
import { Marquee } from "@/components/homePage/shared/marquee";
import { TripLeaderCard } from "@/components/homePage/shared/trip-leader-card";

const tripLeaders = [
  { name: "Kyle May", image: "/travel-guide-portrait-professional-man.jpg" },
  {
    name: "Sarah Johnson",
    image: "/travel-guide-portrait-professional-woman.jpg",
  },
  { name: "Mike Chen", image: "/adventure-guide-portrait-man-outdoor.jpg" },
  {
    name: "Emma Wilson",
    image: "/travel-guide-portrait-professional-woman.jpg",
  },
  { name: "James Brown", image: "/travel-guide-portrait-professional-man.jpg" },
  { name: "Olivia Davis", image: "/adventure-guide-portrait-man-outdoor.jpg" },
];

export function TripLeadersSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 mb-10">
        <SectionHeader
          title="Meet Trip Leaders"
          viewAllHref="/leaders"
          className="justify-center"
        />
      </div>

      <Marquee speed="normal" pauseOnHover>
        {tripLeaders.map((leader) => (
          <TripLeaderCard
            key={leader.name}
            name={leader.name}
            image={leader.image}
          />
        ))}
      </Marquee>
    </section>
  );
}
