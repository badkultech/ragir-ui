"use client";

// import Card from "@/components/homePage/Card";
// import Header from "@/components/homePage/Header";
// import Section from "@/components/homePage/Section";
// import Region from "@/components/homePage/Region";
// import Slider from "@/components/homePage/Slider";
// import Image from "next/image";
// import { Marquee } from "@/components/homePage/shared/marquee";

// import { ChevronRight } from "lucide-react";

// export default function Home() {
//   const logos = [
//     "logo.png",
//     "logo.png",
//     "logo.png",
//     "logo.png",
//     "logo.png",
//     "logo.png",
//     "logo.png",
//     "logo.png",
//     "logo.png",
//   ];
//   return (
//     <>
//       <Header />
//       <main className="min-h-screen max-w-[1500px] mx-auto p-8 md:p-16 md:px-20">
//         <div className=" mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="flex flex-col gap-8">
//             <h1 className="text-4xl md:text-6xl font-semibold font-barlow italic mb-4">
//               Join Group Trips. Meet Like Minded Travelers.
//               <br />
//               Around the World!
//             </h1>
//           </div>
//           <div></div>
//         </div>

//         {/* Explore Cards */}

//         <Section
//           child={
//             <div className="flex gap-5 mx-auto justify-center ">
//               <Card title="Winter-Specials" icon="Snowflake" />
//               <Card title="Biggest Discounts" icon="Tag" />
//               <Card title="Popular Trips" icon="Telescope" />
//             </div>
//           }
//         />

//         <Section
//           heading="Our Trusted Partners"
//           child={
//             <>
//               <Marquee
//                 children={
//                   <div className="flex flex-col gap-20">
//                     <div className="brands flex justify-center gap-8">
//                       {logos.map((l, i) => (
//                         <Image
//                           key={i}
//                           src={l}
//                           width={100}
//                           height={100}
//                           alt="logo"
//                         />
//                       ))}
//                     </div>
//                     <span className="text-[22px] cursor-pointer font-poppins text-center hover:text-gray-800 transition-transform duration-600 text-orange-600 font-medium">
//                       View All
//                       <ChevronRight
//                         width={24}
//                         height={24}
//                         className="inline ml-4"
//                       />
//                     </span>
//                   </div>
//                 }
//               />
//             </>
//           }
//         />

//         <Section heading="Explore Regions" child={<Region />} />

//         <Slider />
//       </main>
//     </>
//   );
// }

import { Header } from "@/components/homePage/sections/header";
import { HeroSection } from "@/components/homePage/sections/hero-section";
import { CategoriesSection } from "@/components/homePage/sections/categories-section";
import { PartnersSection } from "@/components/homePage/sections/partners-section";
import { RegionsSection } from "@/components/homePage/sections/regions-section";
import { TripLeadersSection } from "@/components/homePage/sections/trip-leaders-section";
import { Footer } from "@/components/homePage/sections/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <CategoriesSection />
      <PartnersSection />
      <RegionsSection />
      <TripLeadersSection />
      <Footer />
    </main>
  );
}
