import React from "react";
import styles from "../prelaunch.module.css"

/**
 * Reusable Section Component
 * Provides consistent section layout with heading and content
 */
const Section = ({ child, heading }: { child: React.JSX.Element, heading: string | React.JSX.Element }) => {
  return (
    <section className={`${styles.poppins} my-[3.5rem] md:my-[7.5rem] w-full `}>
      <h2 className={`${styles.barlow} text-[2.5rem] md:text-[3.85rem] text-center font-[900] pb-[2.5rem] md:pb-[5rem] barlow text-black`}>{heading}</h2>
      {child}
    </section>
  );
};

export default Section;
