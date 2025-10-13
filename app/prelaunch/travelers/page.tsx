"use client";

import Image from "next/image";
import React, { useRef } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Section from "../components/Section";
import Content from "../components/how_it_works/Content";
import styles from "../prelaunch.module.css";
import { MoveRight } from "lucide-react";
import WhyRagirCard from "../components/WhyRagirCard";
import AutoScrollCarousel from "../components/AutoplayCarousel";
import { PartnerRequest } from "@/lib/services/prelaunch/partners/types";
import { useJoinAsPartnerMutation } from "@/lib/services/prelaunch/partners";
import { showError, showSuccess } from "@/lib/utils/toastHelpers";
import SmartAnimate from "../components/SmartAnimateHIW";

const Travelers = () => {
  // ✅ separate refs for hero & banner forms
  const heroEmailRef = useRef<HTMLInputElement>(null);
  const bannerEmailRef = useRef<HTMLInputElement>(null);

  const [joinAsPartner, { isLoading }] = useJoinAsPartnerMutation();

  // ✅ shared logic for submitting any email
  const handleEmailSubmit = async (email: string) => {
    if (!email) return;
    const payload: PartnerRequest = {
      email,
      phone: "1234567890", // dummy data
      organizerName: "Traveler",
      partnerType: "USER",
    };
    try {
      await joinAsPartner(payload).unwrap();
      showSuccess("🎉 Thanks! You’ll be notified when we go live!");
    } catch (err) {
      console.error("Error submitting email:", err);
      showError("Something went wrong. Please try again later.");
    }
  };

  // ✅ handlers for both forms
  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = heroEmailRef.current?.value.trim() || "";
    await handleEmailSubmit(email);
    if (heroEmailRef.current) heroEmailRef.current.value = "";
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = bannerEmailRef.current?.value.trim() || "";
    await handleEmailSubmit(email);
    if (bannerEmailRef.current) bannerEmailRef.current.value = "";
  };

  return (
    <>
      <Header
        button={{
          link: "/prelaunch",
          text: "Join as Partner",
        }}
      />

      <main className="text-[18px] leading-relaxed px-[1.25rem] md:px-[4.5rem] relative w-full overflow-hidden max-w-[1400px] mx-auto">

        {/* ✅ HERO SECTION */}
        <section className={`${styles.poppins} intro_section w-full grid grid-cols-1 lg:grid-cols-2 gap-10 mt-6 md:mt-10`}>
          <div className="content pt-6 md:pt-12">
            <h1 className={`${styles.barlow} text-[2.125rem] md:text-[3rem] font-[700] pb-3 leading-tight`}>
              India’s Travel Scene is About to Get a Glow Up✨
            </h1>

            <p className="text-[1.15rem] md:text-[1.4rem] font-[400] text-[#575757] py-4 leading-relaxed">
              At Ragir, we are building the{" "}
              <span className="font-[600] italic">biggest</span> and
              <span className="italic font-[600]">
                {" "}
                most diverse hub of fixed-departure group trips
              </span>{" "}
              in India.
            </p>

            <p className="text-[1.35rem] md:text-[1.55rem] font-[500] pt-6">
              Don’t miss the drop — <br /> get notified when it’s live!
            </p>

            {/* ✅ single responsive form */}
            <form
              onSubmit={handleHeroSubmit}
              className="flex flex-col md:flex-row mt-6 md:mt-5 justify-between w-full md:max-w-[90%] border rounded-[100px] p-3 md:p-4 overflow-hidden"
            >
              <input
                ref={heroEmailRef}
                type="email"
                required
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 text-[1.15rem] focus:outline-none rounded-full"
              />

              <button
                type="submit"
                disabled={isLoading}
                className={`${styles.theme_btn_1} group rounded-full mt-3 md:mt-0 px-5 py-[0.8rem] text-[1.1rem] flex items-center justify-center gap-2 transition-all duration-500 ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
              >
                {isLoading ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <span className="group-hover:opacity-0 transition-all duration-300">
                      Submit
                    </span>
                    <MoveRight
                      className="inline-block group-hover:block group-hover:translate-x-[-2rem] transition-all duration-500 group-hover:scale-x-150"
                      size={22}
                    />
                  </>
                )}
              </button>
            </form>

            <Link href="/organizer/privacy-policy" target="_blank" rel="noopener noreferrer">
              <p className="max-md:text-center text-[1.1rem] text-[#575757] pt-4">
                View <span className="underline font-[600]">Privacy Policy</span>
              </p>
            </Link>
          </div>

          {/* Image */}
          <div className="img flex items-center justify-center">
            <div className="w-full lg:w-[80%] mx-auto overflow-hidden rounded-xl">
              <Image
                src="/prelaunch-page-imgs/traveler's-hero.webp"
                alt="Image showing travellers having fun"
                width={1000}
                height={800}
                className="w-full h-auto object-contain"
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 700px"
              />
            </div>
          </div>
        </section>

        {/* What we do */}
        <Section
          heading={
            <>
              What we do?
              <span className="text-[1.5rem] md:text-[2rem] block italic font-[500] pt-[1.5rem]">
                We handpick the most amazing fixed departure group trips and
                list them for you.
              </span>
              <span
                className={`${styles.barlow} block text-[1.1rem] md:text-[1.5rem] text-[#575757] font-[500] pt-[1rem]`}
              >
                Before listing, we check the quality of every trip and
                reliability of every organizer. Then we list them by the
                categories of experience they offer. So you find the right trip,
                at the right time, in the right mood.
              </span>
            </>
          }
          child={
            <>
              <h2 className="text-[1.35rem] md:text-[2rem] italic font-[500] pb-[2rem] md:pb-[3.5rem] text-center">
                <span className={`${styles.grad_txt} pr-[5px]`}>Ragir</span> is
                your one place to discover, compare, and join trips that match
                your traveling mood.
              </h2>
              <AutoScrollCarousel />
            </>
          }
        />

        {/* How It Works */}
        <Section
          heading="How It Works"
          child={
            <div className="flex flex-col items-center justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 w-full md:w-[90%]">
                <Content
                  Heading="Pick Your Moods or Destinations"
                  content={
                    <>
                      <span className="block text-[1.05rem]">
                        Ragir’s mood-based search lets you pick multiple travel
                        moods at a time so you find trips that truly fit your
                        mood.
                      </span>
                      <span className="block pt-2 text-[1.05rem]">
                        Or use our destination-based search, pick where you want
                        to go and when, and discover unique trips heading there.
                      </span>
                    </>
                  }
                  direction="left"
                  optional="order-2 sm:order-1"
                />
                <div className="order-1 sm:order-2">
                  <SmartAnimate folder="prelaunch-frames" frameCount={8} />
                </div>
                <div className="order-1 sm:order-2">
                  <SmartAnimate folder="explore_itineraries" frameCount={3} />
                </div>

                <Content
                  Heading="Explore Itineraries"
                  content={
                    <>
                      <span className="block text-[1.05rem]">
                        Browse trips from our trusted partners. Each page shows
                        all the information you need to make an informed choice.
                      </span>
                    </>
                  }
                  direction="right"
                  optional="order-4"
                />

                <Content
                  Heading="Compare Options"
                  content={
                    <>
                      <span className="block text-[1.05rem]">
                        Confused between trips? Use Compare to see which fits
                        you best — even drag and drop details that matter most.
                      </span>
                    </>
                  }
                  direction="left"
                  optional="max-sm:order-6 order-5"
                />
                <div className="max-sm:order-5 order-6">
                 <div className="order-1 sm:order-2">
                  <SmartAnimate folder="compare_options" frameCount={4} />
                </div>
                </div>

                <div className="order-7">
                 <div className="order-7 sm:order-2">
                  <SmartAnimate folder="join_the_group" frameCount={2} />
                </div>
                </div>
                <Content
                  Heading="Join the Group"
                  content={
                    <>
                      <span className="block text-[1.05rem]">
                        Tap “Request Invite” to let the organizer know you want
                        to join. Once confirmed, you’ve locked in your journey.
                      </span>
                    </>
                  }
                  direction="right"
                  optional="order-8"
                />

                <Content
                  Heading="Explore the World"
                  content={
                    <>
                      <span className="block text-[1.05rem]">
                        Show up, meet new people, make memories, and explore the
                        world!
                      </span>
                    </>
                  }
                  direction="left"
                  optional="order-9 max-sm:order-10"
                />
                <div className="order-10 max-sm:order-9">
                  <SmartAnimate folder="explore_the_world" frameCount={2} />
                </div>
              </div>
            </div>
          }
        />

        {/* Why Ragir */}
        <Section
          heading={
            <>
              Why<span className={styles.grad_txt + " pl-1"}> Ragir?</span>
            </>
          }
          child={
            <div className="flex flex-col gap-6 w-full mx-auto">
              <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
                <WhyRagirCard
                  icon="/prelaunch-page-imgs/search.png"
                  heading="Clutter-Free Search"
                  description="A simple search to find the right group trips based on moods and destinations"
                />
                <WhyRagirCard
                  icon="/prelaunch-page-imgs/filter.png"
                  heading="Smart Filters"
                  description="Filter by destinations, moods, budget, duration, dates, popularity, and reviews"
                />
                <WhyRagirCard
                  icon="/prelaunch-page-imgs/trusted.png"
                  heading="Trusted Organizers"
                  description="Find trips from organizers that have been vetted for quality and credibility"
                />
              </div>

              <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
                <WhyRagirCard
                  icon="/prelaunch-page-imgs/compare.png"
                  heading="Side-by-Side Comparison"
                  description="Compare the details that matter most and see your options transparently"
                />
                <WhyRagirCard
                  icon="/prelaunch-page-imgs/community-transparent.png"
                  heading="Community Insight"
                  description="Learn from reviews shared by fellow travelers"
                />
              </div>
            </div>
          }
        />

        {/* ✅ BANNER SECTION (separate emailRef) */}
        <div className="rounded-2xl banner_section my-10 w-full bg-[url('/prelaunch-page-imgs/banner.jpg')] bg-cover bg-center">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-8 py-10">
            <div className="rounded-2xl border border-white/20 bg-[rgba(0,0,0,0.35)] backdrop-blur-sm p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-8">
                <div className="md:col-span-7">
                  <h1 className="text-3xl md:text-[3.2rem] font-extrabold text-white leading-tight">
                    Get Notified when we are live!
                  </h1>
                </div>

                <div className="md:col-span-5">
                  <form onSubmit={handleBannerSubmit} className="w-full">
                    <div className="flex items-center gap-3 w-full justify-center">
                      <div className="rounded-full bg-white p-1 flex items-center gap-2 shadow-md w-full">
                        <input
                          ref={bannerEmailRef}
                          type="email"
                          required
                          placeholder="Enter your email"
                          className="flex-1 bg-transparent placeholder-gray-400 text-base md:text-lg px-4 py-3 rounded-full outline-none"
                        />
                        <button
                          type="submit"
                          disabled={isLoading}
                          className={`${styles.theme_btn_1} inline-flex items-center gap-2 rounded-full px-5 py-3 text-base md:text-lg font-medium transition-all duration-300 ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                        >
                          {isLoading ? (
                            "Submitting..."
                          ) : (
                            <>
                              <span className="hidden md:inline">Submit</span>
                              <span className="inline md:hidden">Go</span>
                              <MoveRight size={20} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="mt-3 text-sm text-white/90">
                    <a
                      href="/organizer/privacy-policy"
                      target="_blank"
                      className="hover:underline"
                    >
                      View Privacy Policy
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Travelers;