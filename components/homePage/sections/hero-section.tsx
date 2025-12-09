import { SearchTripsCard } from "@/components/homePage/shared/search-trips-card";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative min-h-[700px] overflow-hidden bg-gradient-to-br from-orange-50/50 via-white to-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-foreground leading-[1.1] tracking-tight">
              Join Group Trips. Meet Like Minded Travelers. Around the World!
            </h1>
            <p className="text-muted-foreground text-base max-w-md leading-relaxed">
              An all-in-one platform to discover the most incredible group
              trips, connect with like-minded travelers and be part of a
              thriving community that shares your passion for exploration and
              connection.
            </p>

            <div className="pt-4">
              <Image
                alt=""
                width={240}
                height={120}
                src={"./hero-images-dummy.png"}
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>
            {/* for Indivisual images */}
            {/* <div className="pt-4 grid grid-cols-2 gap-3 max-w-md"> */}
            {/* Top left - tall pill shape */}
            {/* <div className="overflow-hidden animate-float">
                <div className="w-full h-32 rounded-[50px] overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src="/person-standing-on-cliff-overlooking-mountains-nor.jpg"
                    alt="Traveler on cliff"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div> */}

            {/* Top right - wider rounded rectangle */}
            {/* <div className="overflow-hidden animate-float-delayed">
                <div className="w-full h-32 rounded-3xl overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src="/northern-lights-aurora-borealis-night-sky.jpg"
                    alt="Northern lights"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div> */}

            {/* Bottom left - rounded rectangle */}
            {/* <div className="overflow-hidden animate-float-slow">
                <div className="w-full h-28 rounded-3xl overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src="/ancient-bridge-architecture-silhouette-sunset.jpg"
                    alt="Bridge silhouette"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div> */}

            {/* Bottom right - smaller rounded */}
            {/* <div className="overflow-hidden animate-float">
                <div className="w-3/4 h-28 rounded-[40px] overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src="/group-of-hikers-with-backpacks-mountains.jpg"
                    alt="Group of hikers"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div> */}
            {/* </div> */}
          </div>

          <div className="flex justify-center lg:justify-end">
            <SearchTripsCard />
          </div>
        </div>
      </div>
    </section>
  );
}
