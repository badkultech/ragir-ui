"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

const frames = [
  "/prelaunch-frames/frame1.png",
  "/prelaunch-frames/frame2.png",
  "/prelaunch-frames/frame3.png",
  "/prelaunch-frames/frame4.png",
  "/prelaunch-frames/frame5.png",
  "/prelaunch-frames/frame6.png",
  "/prelaunch-frames/frame7.png",
  "/prelaunch-frames/frame8.png",
];

export default function SmartAnimateHIW() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % frames.length);
    }, 5000); // adjust speed (ms)
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-auto rounded-2xl overflow-hidden">
      <div className="relative w-full aspect-[16/9] md:aspect-[4/3] overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={frames[index]}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -10 }}
            transition={{
              duration: 1.1,
              ease: [0.65, 0, 0.35, 1], // smooth figma-like ease
            }}
            className="absolute inset-0"
          >
            <Image
              src={frames[index]}
              alt={`Smart Animate frame ${index + 1}`}
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* small dot indicators */}
      {/* <div className="flex justify-center gap-2 mt-4">
        {frames.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full transition-all ${
              i === index ? "bg-pink-500 w-4" : "bg-gray-300"
            }`}
          />
        ))}
      </div> */}
    </div>
  );
}
