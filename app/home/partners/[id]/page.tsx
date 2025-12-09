import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Youtube, Globe, Instagram, Calendar } from "lucide-react";
import { TestimonialCard } from "@/components/homePage/shared/testimonial-card";
import { CertificationItem } from "@/components/homePage/shared/certification-item";
import { CheckCircle } from "lucide-react";

const partnersData: Record<
  string,
  {
    name: string;
    tagline: string;
    logo: string;
    heroImage: string;
    about: string[];
    testimonials: { quote: string; author: string; role: string }[];
    certifications: { title: string; date: string }[];
  }
> = {
  "the-lalit": {
    name: "The Lalit",
    tagline: "Creating unforgettable experiences, one event at a time",
    logo: "/the-lalit-hotel-logo.jpg",
    heroImage: "/luxury-hotel-building-night-view-illuminated.jpg",
    about: [
      "Welcome to Bon Ton Events! We are passionate about creating memorable experiences that bring people together. With over 5 years of experience in the event management industry, we specialize in organizing corporate events, cultural festivals, adventure activities, and community gatherings.",
      "Our dedicated team works tirelessly to ensure every event is executed flawlessly, from initial planning to final execution. We believe in attention to detail, creativity, and delivering exceptional value to our attendees. Whether it's an intimate workshop or a large-scale festival, we bring the same level of enthusiasm and professionalism to every project.",
      "Join us in our upcoming events and be part of experiences that inspire, connect, and create lasting memories!",
    ],
    testimonials: [
      {
        quote:
          "Absolutely fantastic event! The organization was impeccable and the experience exceeded all expectations. I've attended multiple events by Bon Ton and they never disappoint.",
        author: "Sarah Mitchell",
        role: "Marketing Professional",
      },
      {
        quote:
          "Professional, creative, and incredibly well-managed. The team's attention to detail made all the difference. Highly recommend their events to anyone!",
        author: "Rajesh Kumar",
        role: "Entrepreneur",
      },
    ],
    certifications: [
      { title: "Event Management Professional", date: "12/12/25" },
      { title: "Adventure Sports Certification", date: "12/12/25" },
      { title: "Event Management Professional", date: "12/12/25" },
    ],
  },
};

// Generate static params for all partners
export function generateStaticParams() {
  return Object.keys(partnersData).map((id) => ({ id }));
}

export default async function PartnerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const partner = partnersData[id] || partnersData["the-lalit"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/partners"
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-serif italic text-gray-900">
            {partner.name}
          </h1>
        </div>

        {/* Hero Image */}
        <div className="relative rounded-2xl overflow-hidden mb-4">
          <Image
            src={partner.heroImage || "/placeholder.svg"}
            alt={partner.name}
            width={800}
            height={300}
            className="w-full h-48 md:h-64 object-cover"
          />
        </div>

        {/* Logo and Info */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 -mt-10 md:-mt-12 px-4">
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
              <Image
                src={partner.logo || "/placeholder.svg"}
                alt={partner.name}
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <div className="pb-2">
              <h2 className="text-xl font-bold text-gray-900">
                {partner.name}
              </h2>
              <p className="text-gray-500 text-sm">{partner.tagline}</p>
            </div>
          </div>
          {/* Social Icons */}
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center hover:bg-orange-600 transition-colors">
              <Youtube className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center hover:bg-orange-600 transition-colors">
              <Globe className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center hover:bg-orange-600 transition-colors">
              <Instagram className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center hover:bg-orange-600 transition-colors">
              <Calendar className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - About & Testimonials */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Us */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">About Us</h3>
              <div className="space-y-4">
                {partner.about.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-gray-600 text-sm leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                What Our Attendees Say
              </h3>
              <div className="space-y-4">
                {partner.testimonials.map((testimonial, index) => (
                  <TestimonialCard
                    key={index}
                    quote={testimonial.quote}
                    author={testimonial.author}
                    role={testimonial.role}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Verified & Certifications */}
          <div className="space-y-6">
            {/* Verified Badge */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-600 font-medium text-sm">
                  Verified Organiser
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Certifications
              </h3>
              <div className="space-y-4">
                {partner.certifications.map((cert, index) => (
                  <CertificationItem
                    key={index}
                    title={cert.title}
                    date={cert.date}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
