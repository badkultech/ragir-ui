"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/slices/store";
import { useRouter } from "next/navigation";

export function FloatingCompareBadge() {
    const router = useRouter();
    const compareCount = useSelector(
        (state: RootState) => state.compare.tripIds.length
    );

    if (compareCount === 0) return null;

    return (
        <button
            onClick={() => router.push("/home/compare-trips")}
            className="
        fixed 
        right-6 
        top-1/2 
        -translate-y-1/2
        z-50
        flex items-center gap-3
        bg-[#FF804C]
        text-white
        px-5 py-3
        rounded-full
        shadow-lg
        hover:opacity-90
        transition
      "
        >
            <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.5 2.66667H2.66667C2.22464 2.66667 1.80072 2.84226 1.48816 3.15482C1.17559 3.46738 1 3.89131 1 4.33333V14.3333C1 14.7754 1.17559 15.1993 1.48816 15.5118C1.80072 15.8244 2.22464 16 2.66667 16H8.5M11.8333 2.66667H12.6667C13.1087 2.66667 13.5326 2.84226 13.8452 3.15482C14.1577 3.46738 14.3333 3.89131 14.3333 4.33333V5.16667M14.3333 13.5V14.3333C14.3333 14.7754 14.1577 15.1993 13.8452 15.5118C13.5326 15.8244 13.1087 16 12.6667 16H11.8333M14.3333 8.5V10.1667M7.66667 1V17.6667"
                    stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span className="font-medium">
                Compare {compareCount.toString().padStart(2, "0")}
            </span>
        </button>
    );
}
