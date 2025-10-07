import Image from "next/image";
import React from "react";
import styles from "../../prelaunch.module.css"


export default function Tile({ img, title }: { img: string, title: string}): React.JSX.Element {
  return (
    <div className={`${styles.box_shadow} flex items-center gap-x-6 rounded-full py-[1.25rem] pl-5 my-4`}>
      <Image src={img} alt="Feature Image showing a unique icon related to feature" width={200} height={200} className="w-[60px] h-auto" />
      <h3 className="text-[1.45rem] sub-text font-[400] opacity-70">{title}</h3>
    </div>
  )
}
