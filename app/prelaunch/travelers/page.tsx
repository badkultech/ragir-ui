"use client";

import Image from "next/image";
import React from "react";
import { useRef } from 'react'
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Section from "../components/Section";
import Content from "../components/how_it_works/Content";
import styles from "../prelaunch.module.css"
import { MoveRight } from "lucide-react";
import WhyRagirCard from "../components/WhyRagirCard";
import { ROUTES } from "@/lib/utils";


const Travelers = () => {
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailRef.current) {
      alert(`Email entered: ${emailRef.current.value}`);
    }
  }

  return (
    <>
      <Header button={{
        link: ROUTES.COMMON.PRELAUNCH,
        text: "Join as Partners"

      }} />
      <main className="px-[1rem] md:px-[5rem] relative w-full overflow-hidden max-w-[1500px] mx-auto">
        {/* Hero Section */}
        <section className={`${styles.poppins} intro_section w-full grid grid-cols-1 lg:grid-cols-2 gap-[5rem] mt-[1.5rem] md:mt-[5rem]`}>
          <div className="content ">
            <h1 className={`${styles.barlow} text-[2rem] md:text-[3rem] font-[600] md:font-[700] pb-3 leading-tight`}>
              India’s Travel Scene is About to Get a Glow Up ✨
            </h1>

            <p className="text-[1rem] md:text-[1.25rem] font-[400] text-[#575757] py-3 leading-relaxed">
              At Ragir, we are building the <span className="font-[600] italic">biggest</span> and
              <span className="italic font-[600]"> most diverse hub of fixed-departure group trips</span> in India.
            </p>

            <p className="text-[1.25rem] md:text-[1.75rem] font-[500] pt-2">
              Don’t miss the drop — get notified when it’s live!
            </p>


            <form onSubmit={handleSubmit} className="flex max-md:flex-col mt-[2.5rem] md:mt-[4rem] justify-between w-full md:max-w-[90%] border rounded-[100px] p-4 md:p-3 overflow-hidden">
              <input
                ref={emailRef}
                type="email"
                placeholder="Enter your email"
                className="flex-1 w-[60%] px-4 py-4 focus:outline-none outline-none"
              />
              <button className={`${styles.theme_btn_1} max-md:hidden group rounded-full px-5 py-[0.8rem] text-[1.5rem] flex items-center gap-2 transition-all duration-500`}>
                <span className="group-hover:opacity-0 transition-all duration-300"> Submit</span>
                <MoveRight className="inline-block group-hover:block group-hover:translate-x-[-2rem] transition-all duration-500 group-hover:scale-x-150" size={20} />
              </button>
            </form>
            <button className={`${styles.theme_btn_1} max-md:flex hidden justify-center mt-4 group rounded-full px-[2rem] py-4 text-[1.25rem] items-center gap-2 w-full transition-all duration-500`}>
              <span className="group-hover:opacity-0 transition-all duration-300"> Submit</span>
              <MoveRight className="inline-block group-hover:block group-hover:translate-x-[-2rem] transition-all duration-500 group-hover:scale-x-150" size={24} />
            </button>
            <Link href={ROUTES.ORGANIZER.PRIVACY_POLICY} target="_blank" rel="noopener noreferrer">
              <p className="max-md:text-center text-[1.25rem] text-[#575757] pt-4">
                View <span className="underline font-[600]">Privacy Policy</span>
              </p>
            </Link>

          </div>
          <div className="img">
            <Image src="/prelaunch-page-imgs/traveler's-hero.webp" alt="Image showing travellers having fun" width={2412} height={1996} className="w-full lg:w-[80%] mx-auto" />
          </div>
        </section>

        {/* What we do */}
        <Section
          heading={
            <>
              What we do?
              <span className="text-[1.5rem] md:text-[2.25rem] block italic font-[500] pt-[2.5rem]">
                We handpick the most amazing fixed departure group trips and list them for you.
              </span>
              <span className={`${styles.barlow} block text-[1rem] max-md:leading-[1.6] md:text-[1.75rem] text-[#575757] font-[500] pt-[2.5rem] `}>
                Before listing, we check the quality of every trip and reliability of every trip organizer.
                Then we list those trips by the categories of experience it offers to the travelers.
                So that you find the right trip, at the right time, in the right mood.
              </span>
            </>
          }
          child={
            <>
              <h2 className="text-[1.5rem] max-md:text-center md:text-[3rem]  italic font-[500] pb-[2.5rem] md:pb-[5rem]">
                <span className={styles.grad_txt + " " + "pl-1"}>
                  Ragir
                </span> is your one place to discover, compare, and join trips that match your traveling mood.
              </h2>
              <div>
                <Image
                  src="/prelaunch-page-imgs/adventures.webp" alt="diff types of adventures"
                  width={4000} height={2000}
                  className=" w-full md:w-[95%] mx-auto "
                />
              </div>
            </>
          } />

        {/* How It Works */}
        <Section heading="How It Works" child={

          <div className="flex flex-col items-center justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[5rem] gap-y-6 lg:gap-y-[4rem] w-full md:w-[90%]">
              {/* Step 1 */}
              <Content Heading="Pick Your Moods or Destinations"
                content={
                  <>
                    <span className="block text-[1.1rem]">
                      Ragir’s mood-based search lets you pick multiple travel moods at a time so that you find trips that truly fit your mood.
                      <br /></span>
                    <span className=" block pt-2 text-[1.1rem]">
                      Or you can use our destination-based search, pick where you want to go and when, and discover all the unique trips heading there at that time.
                    </span>
                  </>
                }
                direction="left" optional="order-2 sm:order-1" />
              <div className="order-1 sm:order-2">
                <Image src="/prelaunch-page-imgs/travelers-hiw-1.webp" alt="How It Works Image" width={2000} height={1000} className="w-full" />
              </div>

              {/* Step 2 */}
              <div className="order-3" >
                <Image src="/prelaunch-page-imgs/travelers-hiw-2.webp" alt="How It Works Image" width={2000} height={1000} className="w-full" />
              </div>
              <Content Heading="Explore Itineraries"
                content={<>
                  <span className="block text-[1.1rem]">
                    Browse trips from our trusted partners.              <br /></span>
                  <span className=" block pt-2 text-[1.1rem]">
                    Every trip page has all the information you need to know to make an informed choice.                </span>
                </>
                } direction="right" optional="order-4" />

              {/* Step 3 */}
              <Content Heading="Compare Options"
                content={<>
                  <span className="block text-[1.1rem]">
                    Confused between multiple trips? All look exciting?           <br /></span>
                  <span className=" block pt-2 text-[1.1rem]">
                    Use our Compare feature to cut through the confusion and see which trip truly fits you best.
                  </span>
                  <span className=" block pt-2 text-[1.1rem]">
                    You can also drag and drop the detail you want to compare according to what matters most to you.                </span>
                </>

                }
                direction="left" optional="max-sm:order-6 order-5" />
              <div className="max-sm:order-5 order-6">
                <Image src="/prelaunch-page-imgs/travelers-hiw-3.webp" alt="How It Works Image" width={2000} height={1000} className="w-full" />
              </div>
              {/* Step 4 */}
              <div className=" order-7">
                <Image src="/prelaunch-page-imgs/travelers-hiw-3.webp" alt="How It Works Image" width={2000} height={1000} className="w-full" />
              </div>
              <Content Heading="Join the Group"
                content={<>
                  <span className="block text-[1.1rem]">
                    Tap on 'Request Invite' and let the organizer know you want to join.     <br /></span>
                  <span className=" block pt-2 text-[1.1rem]">
                    Once confirmed, you’ve locked in the journey that matches your mood, dates, destinations and other preferences.
                  </span>
                </>
                }
                direction="right" optional="order-8" />
              {/* Step 5 */}
              <Content Heading="Explore the World"
                content={<>
                  <span className="block text-[1.1rem]">
                    Show up at the trip, meet new people, make memories, and explore the world!
                  </span>
                </>
                }
                direction="left" optional="order-9 max-sm:order-10" />
              <div className="order-10 max-sm:order-9">
                <Image src="/prelaunch-page-imgs/travelers-hiw-5.webp" alt="How It Works Image" width={2000} height={1000} className="w-full" />
              </div>
            </div>

          </div>

        } />

        {/* Why Ragir */}

        <Section
          heading={
            <>
              Why
              <span className={styles.grad_txt + " " + "pl-1"}> Ragir?</span>
            </>
          }
          child={
            <>
              <div className="flex flex-col gap-6 w-full mx-auto">
                <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
                  <WhyRagirCard icon="/prelaunch-page-imgs/search.png" heading="Clutter-Free Search"
                    description="A simple search to find the right group trips based on moods and destinations" />

                  <WhyRagirCard icon="/prelaunch-page-imgs/filter.png" heading="Smart Filters"
                    description="Filter and sort by destinations, moods, budget, duration, dates, popularity and reviews" />

                  <WhyRagirCard icon="/prelaunch-page-imgs/trusted.png" heading="Trusted Organizers"
                    description="Find trips from organizers that have been vetted for quality and credibility" />
                </div>
                <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
                  <WhyRagirCard icon="/prelaunch-page-imgs/compare.png" heading="Side-by-Side Comparison"
                    description="Compare the details that matter most and see your options transparently" />

                  <WhyRagirCard icon="/prelaunch-page-imgs/community-transparent.png" heading="Community Insight"
                    description="Learn from reviews shared by fellow travelers" />
                </div>
              </div>
            </>
          } />


        {/* Banner for desktop*/}
        <div className="hidden banner_section my-[5rem] w-full min-h-[400px] md:flex max-md:justify-center align-center rounded-[2.5rem] px-10 py-10 bg-[url('/prelaunch-page-imgs/banner.jpg')] bg-cover bg-center">
          <div className="w-[90%] max-md:mx-auto md:w-[80%] rounded-[1.5rem] border border-white py-6 px-8 h-[calc(100%-4rem)] bg-[rgba(0,0,0,0.3)] backdrop-blur-[5px] ">
            <h1 className="text-[4rem] font-[700] text-white h-full">
              Get Notified when we are live!
            </h1>
            <form onSubmit={handleSubmit} className=" bg-white flex max-md:flex-col mt-4 justify-between w-full md:max-w-[90%] border rounded-[100px] p-4 md:p-3 overflow-hidden">
              <input
                ref={emailRef}
                type="email"
                placeholder="Enter your email"
                className="flex-1 w-[60%] px-4 py-4 focus:outline-none"
              />
              <button className={`${styles.theme_btn_1} max-md:hidden group rounded-full px-5 py-[0.8rem] text-[1.5rem] flex items-center gap-2 transition-all duration-500`}>
                <span className="group-hover:opacity-0 transition-all duration-300"> Submit</span>
                <MoveRight className="inline-block group-hover:block group-hover:translate-x-[-2rem] transition-all duration-500 group-hover:scale-x-150" size={20} />
              </button>
            </form>
          </div>
        </div>

        {/* Banner for mobile */}

        <div className="hidden banner_section mt-[1rem] w-full min-h-[450px] mb-[1.5rem] max-md:flex max-md:justify-center align-center rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 bg-[url('/prelaunch-page-imgs/banner.jpg')] bg-cover bg-center">
          <div className="w-full max-md:mx-auto md:w-[60%] rounded-[1.5rem] md:rounded-[2rem] border border-white p-6 md:py-6 md:px-8 h-[calc(100%-4rem)] bg-[rgba(0,0,0,0.3)] backdrop-blur-[5px] ">
            <h1 className={`${styles.barlow} text-[3.5rem] md:text-[4.5rem] font-[700] text-white`}>
              Join the Movement!
            </h1>
            <p className="text-[1.25rem] md:text-[1.5rem] text-white py-6 md:py-[2rem]">Get started today and be discovered by millions of eager travelers</p>
            <button className="bg-white max-md:justify-center max-md:w-full group rounded-full px-6 py-[0.8rem] text-[1rem] flex items-center gap-2 transition-all duration-500">
              <span className="group-hover:opacity-0 transition-all duration-300 text-[1.25rem] font-[500]"> Join as Partner</span>
              <MoveRight className="inline-block group-hover:block group-hover:translate-x-[-5rem] transition-all duration-500 group-hover:scale-x-150" size={24} />
            </button>
          </div>
        </div>

      </main>

      {/* Footer  */}
      <Footer />
    </>
  )
}

export default Travelers