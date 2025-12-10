import { SectionHeader } from "@/components/homePage/shared/section-header";
import { Marquee } from "@/components/homePage/shared/marquee";
import { PartnerLogo } from "@/components/homePage/shared/partner-logo";
import Link from "next/link";

const partners = [
  "/tp-logo1.jpg",
  "/tp-logo2.png",
  "/tp-logo3.png",
  "/tp-logo4.png",
  "/tp-logo5.png",
  "/tp-logo6.png",
  "/tp-logo7.png",
  "/tp-logo8.png",
];

export function PartnersSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 mb-8">
        <SectionHeader
          title="Our Trusted Partners"
          className="justify-center"
        />
      </div>

      <Marquee speed="slow" pauseOnHover>
        {partners.map((partner, i) => (
          <PartnerLogo key={i} logo={partner} />
        ))}
      </Marquee>

      <div className="text-center my-8 ">
        <Link
          href="/home/partners"
          className="text-lg text-[#ff804c]  hover:text-primary/80 transition-colors"
        >
          View All →
        </Link>
      </div>
    </section>
  );
}
