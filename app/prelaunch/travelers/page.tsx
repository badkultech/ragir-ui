"use client";

import Image from "next/image";
import React from "react";
import {useRef} from 'react'
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Section from "../components/Section";
import Card from "../components/Card";
import Content from "../components/how_it_works/Content";
import Feature from "../components/more_about_ragir/Feature";
import Tile from "../components/why_choose_ragir/Tile";
import styles from "../prelaunch.module.css"
import {MoveRight} from "lucide-react";
import { divide } from "lodash";

const Travelers = () => {
    const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailRef.current) {
      alert(`Email entered: ${emailRef.current.value}`);
    }}

  return (
   <>
   <Header/>
    <main className="px-[5rem] relative w-full overflow-hidden max-w-[1500px] mx-auto">
        {/* Hero Section */}
     <section className={`${styles.poppins} intro_section w-full grid grid-cols-1 md:grid-cols-2 gap-[5rem] mt-[5rem]`}>
        <div className="content max-md:text-center">
            <h1 className={`${styles.poppins} text-[4.5rem] font-[700] pb-5  `}>India’s Travel Scene is about to get a Glow Up✨</h1>
            <p className="text-[1.5rem] font-[400] text-[#575757] py-4">
               At Ragir, we are building the <span className="font-[600] italic">Biggest </span> and <span className="italic font-[600] "> Most diverse hub of fixed departure group trips </span>in India
            </p>
            <p className="text-[2.5rem]  font-[500] pt-4">
                Don’t miss the drop. Get notified when it’s live!
            </p>

            <form onSubmit={handleSubmit} className="flex mt-[4rem] max-w-[90%] border rounded-[100px] p-3 overflow-hidden">
                <input
                    ref={emailRef}
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-4 focus:outline-none"
                />
                <button className={`${styles.theme_btn_1} group rounded-full px-5 py-[0.8rem] text-[1rem] flex items-center gap-2 transition-all duration-500`}>
                    <span className="group-hover:opacity-0 transition-all duration-300"> Submit</span>
                    <MoveRight className="inline-block group-hover:block group-hover:translate-x-[-2rem] transition-all duration-500 group-hover:scale-x-150" size={20}/>
                </button>
            </form>
            
        </div>
        <div className="img">
        <Image src="/prelaunch-page-imgs/traveler's-hero.webp" alt="Image showing travellers having fun" width={2412} height={1996} className="w-full lg:w-[80%] mx-auto"/>
        </div>
    </section>

    {/* What we do */}
    <Section 
        heading={
        <>
            What we do?
            <h2 className="text-[2.25rem] italic font-[500] pt-[2.5rem]">
            We handpick the most amazing fixed departure group trips and list them for you.
            </h2>
            <p className={`${styles.barlow} text-[1.75rem] font-[500 pt-[2.5rem] `}>
                Before listing, we check the quality of every trip and reliability of every trip organizer.
                Then we list those trips by the categories of experience it offers to the travelers.
                So that you find the right trip, at the right time, in the right mood.
            </p>
                </>
                } 
        child={
        <>
           <h2 className="text-[3rem]  italic font-[500] pb-[5rem]">
            <span className={styles.grad_txt + " " + "pl-1"}>
            Ragir  
            </span>    is your one place to discover, compare, and join trips that match your traveling mood.
            </h2> 
            <div>
                 <Image 
                 src="/prelaunch-page-imgs/adventures.webp" alt="diff types of adventures"
                 width={4000} height={2000} 
                 className=" w-[95%] mx-auto "
                 />
            </div>
        </>
    }/>
    
    </main>
   </>
  )
}

export default Travelers