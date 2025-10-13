"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

interface SmartAnimateProps {
  folder: string;          // e.g. "prelaunch-frames"
  frameCount: number;      // number of images
  interval?: number;       // default: 4000ms
  aspectRatio?: string;    // e.g. "16/9", "4/3", etc.
  className?: string;      // extra styling
}

export default function SmartAnimate({
  folder,
  frameCount,
  interval = 4000,
  aspectRatio = "16/9",
  className = "",
}: SmartAnimateProps) {
  const [index, setIndex] = useState(0);

  // Generate paths dynamically
  const frames = Array.from({ length: frameCount }, (_, i) => 
    `/${folder}/frame${i + 1}.png`
  );

  // Auto-play animation
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % frames.length);
    }, interval);
    return () => clearInterval(timer);
  }, [frames.length, interval]);

  return (
    <div className={`relative w-full h-auto rounded-2xl overflow-hidden ${className}`}>
      <div className={`relative w-full aspect-[${aspectRatio}] overflow-hidden rounded-2xl`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={frames[index]}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -10 }}
            transition={{
              duration: 1.1,
              ease: [0.65, 0, 0.35, 1],
            }}
            className="absolute inset-0"
          >
            <Image
              src={frames[index]}
              alt={`Frame ${index + 1}`}
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
