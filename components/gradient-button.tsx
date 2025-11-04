import type React from "react"
import { cn } from "@/lib/utils"
import { type ButtonHTMLAttributes, forwardRef } from "react"

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary"
  children: React.ReactNode
}

const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "w-full py-4 px-6 rounded-full font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
          variant === "primary" && "bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600",
          variant === "secondary" &&
            "bg-transparent border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  },
)
GradientButton.displayName = "GradientButton"

export { GradientButton }
