"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import styles from "../prelaunch.module.css";
import { MoveRight } from "lucide-react";
import { ROUTES } from "@/lib/utils";

/**
 * Header Component
 * Navigation bar with responsive logo and CTA button
 * Features hover animations and mobile-responsive design
 */
export default function Header({
  button,
}: {
  button: { text: string; link: string };
}): React.JSX.Element {
  return (
    <header className={`${styles.header_bg} p-4 md:py-[1.2rem] md:px-[4rem]`}>
      <nav className="flex justify-between items-center">
        <Link href={ROUTES.COMMON.HOME} className="font-bold">
          <Image
            src="/prelaunch-page-imgs/logo-ragir.svg"
            width={100}
            height={100}
            alt="Logo"
            className="block"
          />
        </Link>
        <Link href={button.link}>
          <button
            className={`${styles.theme_btn_1} group rounded-full py-2 px-4  md:px-4 md:py-[0.8rem] text-[1rem] flex items-center gap-2 transition-all duration-500`}
          >
            <span className="group-hover:opacity-0 transition-all duration-300">
              {button.text}
            </span>
            <MoveRight
              className="inline-block group-hover:block group-hover:translate-x-[-2rem] md:group-hover:translate-x-[-3rem] transition-all duration-500 group-hover:scale-x-150"
              size={24}
            />
          </button>
        </Link>
      </nav>
    </header>
  );
}
