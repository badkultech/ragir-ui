import React from "react";
import styles from "../prelaunch.module.css"

/**
 * Reusable Section Component
 * Provides consistent section layout with heading and content
 */
const Section = ({ child, heading }: { child: React.JSX.Element, heading: string | React.JSX.Element }) => {
  return (
    <section className={`${styles.poppins} my-[7.5rem] w-full `}>
      <h2 className={`${styles.barlow} text-[4.5rem] text-center font-[600] text-[#333333] pb-[5rem] barlow `}>{heading}</h2>
      {child}
    </section>
  );
};

export default Section;
