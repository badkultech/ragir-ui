import Image from "next/image"
import { Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function HeroSection() {
  return (
    <div className="relative">
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="h-96 rounded-2xl overflow-hidden relative">
          <Image
            src="/kerala-backwaters.png"
            alt="Trip hero"
            width={800}
            height={600}
            className="w-full h-full object-cover"
          />

          
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="col-span-2 h-64 rounded-2xl overflow-hidden">
            <Image
              src="/himalayan-mountain-valley-landscape.jpg"
              alt="Trip hero"
              width={800}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            "/kerala-backwaters.png",
            "/kerala-backwaters.png",
            "/kerala-backwaters.png",
          ].map((src, i) => (
            <div key={i} className="h-24 rounded-xl overflow-hidden relative">
              <Image src={src} alt="Trip" width={250} height={150} className="w-full h-full object-cover" />
              {i === 2 && (
                <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">+5 more</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
