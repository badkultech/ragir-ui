import Image from "next/image";
import React from "react";
import styles from "../prelaunch.module.css"
/**
 * Feature Card Component
 * Displays service offerings with icon, heading, and bullet points
 * Used in the main offerings section
 */
const Card = ({img, heading, listItems}:{img: string, heading: string, listItems: string[]}) => {
  return (
    <div className={`${styles.box_shadow} card p-6 px-8 rounded-2xl`}>
      <div className=" flex justify-start items-start">
        <Image src={img} alt="card title Image showing a unique icon related to title" width={1000} height={1000}    className=" align-start w-[60px] h-[60px] object-contain" />
      </div>
        <div className="content mt-4 leading-normal">
            <h3 className="text-[2rem] poppins font-[500] sub-txt leading-normal pb-4">{heading}</h3>
            <ul className="text-[1.2rem] font-[400] sub-txt opacity-80 list-disc pl-6 space-y-4">
                {listItems.map((item, index) => (
                    <li key={index} className="tracking-[0.15%] leading-[1.8]">{item} </li>
                ))}
            </ul>
        </div>
    </div>
  );
};

export default Card;
