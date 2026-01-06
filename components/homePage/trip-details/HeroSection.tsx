import Image from "next/image";

interface HeroSectionProps {
  title?: string;
  location?: string;
  imageUrl?: string;
}

export default function HeroSection({
  title = "Trip",
  location = "",
  imageUrl,
}: HeroSectionProps) {

  const fallbackImage = "/kerala-backwaters.png";

  return (
    <div className="relative">

      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="h-96 rounded-2xl overflow-hidden relative">
          <Image
            src={imageUrl || fallbackImage}
            alt={title}
            width={1200}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <div className="col-span-2 h-64 rounded-2xl overflow-hidden">
          <Image
            src={imageUrl || fallbackImage}
            alt={title}
            width={800}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
