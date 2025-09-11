"use client"
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import type React from "react"

const goldenRatio = 1.618033988749895

const fibonacciSpiral = (centerX: number, centerY: number, size: number, rotation: number) => {
  let path = `M${centerX},${centerY} `
  let currentSize = size
  let currentAngle = rotation
  for (let i = 0; i < 8; i++) {
    const endX = centerX + Math.cos(currentAngle) * currentSize
    const endY = centerY + Math.sin(currentAngle) * currentSize
    path += `A${currentSize},${currentSize} 0 0 1 ${endX},${endY} `
    currentSize /= goldenRatio
    currentAngle += Math.PI / 2
  }
  return path
}

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export default function LoadingOverlay({ isLoading, message = "Loading" }: LoadingOverlayProps) {
  const centerX = 150
  const centerY = 150
  const initialPath = useMemo(() => fibonacciSpiral(centerX, centerY, 120, 0), [])
  const spiralControls = useAnimation()
  const particleControls = useAnimation()
  const [isHovered, setIsHovered] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useTransform(mouseY, [0, 300], [10, -10])
  const rotateY = useTransform(mouseX, [0, 300], [-10, 10])

  useEffect(() => {
    if (!isLoading) return;

    const animateSpiral = async () => {
      while (isLoading) {
        await spiralControls.start({
          pathLength: [0, 1],
          transition: { duration: 3, ease: "easeInOut" },
        })
        await spiralControls.start({
          pathLength: 1,
          transition: { duration: 1 },
        })
      }
    }

    const animateRotation = async () => {
      await spiralControls.start({
        rotate: 360,
        transition: { duration: 15, ease: "linear", repeat: Number.POSITIVE_INFINITY },
      })
    }

    const animateParticles = async () => {
      await particleControls.start({
        opacity: [0, 1],
        transition: { duration: 0.8, staggerChildren: 0.05 },
      })
      particleControls.start({
        opacity: [1, 0.5, 1],
        transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
      })
    }

    animateSpiral()
    animateRotation()
    animateParticles()
  }, [spiralControls, particleControls, isLoading])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    mouseX.set(event.clientX - rect.left)
    mouseY.set(event.clientY - rect.top)
  }

  if (!isLoading) return null;

  return (
    <>
      {/* Ultra prominent overlay with multiple layers */}
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-98 backdrop-blur-2xl z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      />
      
      {/* Pulsing colored overlay */}
      <motion.div 
        className="fixed inset-0 bg-gradient-to-br from-orange-900 via-red-900 to-black opacity-40 z-50"
        animate={{ 
          opacity: [0.3, 0.5, 0.3] 
        }}
        transition={{ 
          duration: 3, 
          repeat: Number.POSITIVE_INFINITY, 
          ease: "easeInOut" 
        }}
      />

      {/* Main content overlay */}
      <motion.div 
        className="fixed inset-0 flex items-center justify-center z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex flex-col items-center justify-center relative">
          
          {/* Multiple layers of floating particles */}
          {[...Array(60)].map((_, index) => {
            const size = Math.random() * 6 + 2
            const speed = Math.random() * 3 + 1
            return (
              <motion.div
                key={`floating-${index}`}
                className="absolute rounded-full bg-gradient-to-br from-orange-400 to-red-500 shadow-2xl"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  filter: 'drop-shadow(0 0 8px rgba(254, 169, 1, 0.8))',
                }}
                animate={{
                  opacity: [0.2, 0.9, 0.2],
                  scale: [0.5, 1.2, 0.5],
                  y: [0, -20, 0],
                  x: [0, Math.random() * 10 - 5, 0],
                }}
                transition={{
                  duration: speed,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
            )
          })}

          {/* Enhanced central container with multiple glows */}
          <motion.div
            className="relative w-[350px] h-[350px] cursor-pointer"
            style={{ perspective: 1200 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            animate={{ rotateX, rotateY }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
          >
            {/* Multiple layered glow backgrounds */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FEA901] via-[#FD6E34] to-[#FD401A] rounded-full opacity-15 blur-3xl scale-125 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#FEA901] via-[#FD6E34] to-[#FD401A] rounded-full opacity-25 blur-2xl scale-110"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#FEA901] via-[#FD6E34] to-[#FD401A] rounded-full opacity-30 blur-xl scale-105"></div>
            
            <svg width="350" height="350" viewBox="0 0 300 300" className="relative z-10 scale-110">
              <defs>
                {/* Enhanced multi-stop gradient */}
                <linearGradient id="ultraOrangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFB800">
                    <animate
                      attributeName="stop-color"
                      values="#FFB800; #FF6B35; #FF4500; #FFB800"
                      dur="8s"
                      repeatCount="indefinite"
                    />
                  </stop>
                  <stop offset="25%" stopColor="#FEA901">
                    <animate
                      attributeName="stop-color"
                      values="#FEA901; #FD6E34; #FD401A; #FEA901"
                      dur="8s"
                      repeatCount="indefinite"
                    />
                  </stop>
                  <stop offset="75%" stopColor="#FD6E34">
                    <animate
                      attributeName="stop-color"
                      values="#FD6E34; #FD401A; #FFB800; #FD6E34"
                      dur="8s"
                      repeatCount="indefinite"
                    />
                  </stop>
                  <stop offset="100%" stopColor="#FF4500">
                    <animate
                      attributeName="stop-color"
                      values="#FF4500; #FFB800; #FEA901; #FF4500"
                      dur="8s"
                      repeatCount="indefinite"
                    />
                  </stop>
                </linearGradient>

                {/* Ultra enhanced glow filter */}
                <filter id="ultraGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                  <feGaussianBlur stdDeviation="3" result="coloredBlur2" />
                  <feGaussianBlur stdDeviation="1.5" result="coloredBlur3" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="coloredBlur2" />
                    <feMergeNode in="coloredBlur3" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              
              {/* Double spiral for enhanced effect */}
              <motion.path
                d={initialPath}
                stroke="url(#ultraOrangeGradient)"
                strokeWidth="8"
                fill="none"
                filter="url(#ultraGlow)"
                initial={{ pathLength: 0, rotate: 0 }}
                animate={spiralControls}
                style={{ originX: "150px", originY: "150px" }}
              />
              
              <motion.path
                d={initialPath}
                stroke="url(#ultraOrangeGradient)"
                strokeWidth="4"
                fill="none"
                opacity="0.7"
                initial={{ pathLength: 0, rotate: 0 }}
                animate={{
                  ...spiralControls,
                  rotate: -360,
                }}
                transition={{
                  duration: 20,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }}
                style={{ originX: "150px", originY: "150px" }}
              />
              
              {/* Enhanced particles with varying sizes */}
              {[...Array(16)].map((_, index) => {
                const angle = (index / 16) * Math.PI * 2
                const radius = 80 + (index % 4) * 25
                const size = 4 + (index % 3) * 2
                return (
                  <motion.circle
                    key={index}
                    cx={centerX + Math.cos(angle) * radius}
                    cy={centerY + Math.sin(angle) * radius}
                    r={size}
                    fill="#FFB800"
                    filter="url(#ultraGlow)"
                    initial={{ opacity: 0 }}
                    animate={particleControls}
                  />
                )
              })}
              
              {/* Ultra enhanced central dot with pulse */}
              <motion.circle
                cx={centerX}
                cy={centerY}
                r="15"
                fill="#FF6B35"
                filter="url(#ultraGlow)"
                animate={{
                  opacity: [1, 0.6, 1],
                  scale: isHovered ? [1, 1.4, 1] : [1, 1.2, 1],
                  r: [15, 18, 15],
                }}
                transition={{ 
                  repeat: Number.POSITIVE_INFINITY, 
                  duration: 1.5, 
                  ease: "easeInOut" 
                }}
              />
              
              {/* Multiple orbiting particles */}
              {[1, -1].map((direction, idx) => (
                <motion.circle
                  key={`orbit-${idx}`}
                  cx={centerX}
                  cy={centerY - 100}
                  r="6"
                  fill={idx === 0 ? "#FEA901" : "#FD401A"}
                  filter="url(#ultraGlow)"
                  animate={{
                    rotate: [0, 360 * direction],
                  }}
                  transition={{
                    duration: 8 - idx * 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  style={{
                    originX: "150px",
                    originY: "150px",
                  }}
                />
              ))}
            </svg>
          </motion.div>

          {/* Ultra enhanced text with multiple shadow layers */}
          <motion.div
            className="mt-12 relative z-10 !font-poppins"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1.2 }}
          >
            <div className="text-4xl font-bold text-center">
              <span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-[#FEA901] via-[#FD6E34] to-[#FD401A]"
                style={{ 
                  filter: 'drop-shadow(0 0 20px rgba(254, 169, 1, 1)) drop-shadow(0 0 40px rgba(253, 110, 52, 0.8)) drop-shadow(0 0 60px rgba(253, 64, 26, 0.6))',
                  WebkitTextStroke: '1px rgba(254, 169, 1, 0.3)'
                }}
              >
                {[...message].map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 30, scale: 0.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: 0.5 + index * 0.08, 
                      duration: 0.6,
                      type: "spring",
                      stiffness: 200
                    }}
                    className="inline-block hover:scale-110 transition-transform duration-300"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </span>
            </div>
            
            {/* Animated dots */}
            <motion.div
              className="flex justify-center mt-4 space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-3 h-3 rounded-full bg-gradient-to-r from-[#FEA901] to-[#FD6E34]"
                  style={{ 
                    filter: 'drop-shadow(0 0 8px rgba(254, 169, 1, 0.8))' 
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: index * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Ultra enhanced progress bar */}
          <motion.div
            className="mt-10 w-80 h-4 bg-gray-900 rounded-full overflow-hidden shadow-2xl border-2 border-gray-700 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {/* Progress bar glow background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FEA901] via-[#FD6E34] to-[#FD401A] opacity-20 blur-sm"></div>
            
            <motion.div
              className="h-full bg-gradient-to-r from-[#FEA901] via-[#FD6E34] to-[#FD401A] relative overflow-hidden"
              style={{ 
                boxShadow: '0 0 25px rgba(254, 169, 1, 1), inset 0 0 15px rgba(255, 255, 255, 0.3)' 
              }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 6, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
            >
              {/* Moving highlight effect */}
              <motion.div
                className="absolute top-0 left-0 h-full w-20 bg-white opacity-30 blur-sm"
                animate={{
                  x: ["-100px", "400px"],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}
