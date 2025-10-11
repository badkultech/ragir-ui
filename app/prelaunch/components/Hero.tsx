import Image from "next/image";
import Link from "next/link";
import styles from "../prelaunch.module.css";
export default function Hero(): React.JSX.Element {
  return (
    <>
      {/* Main Hero Section */}
      <section className="hero_section w-full md:w-[57.5%] flex justify-between flex-col md:flex-row items-center lg:overflow-hidden pb-[5rem]">
        <div
          className={`${styles.barlow} content mt-2 md:mt-6 max-md:text-center`}
        >
          <h1 className="text-[1.75rem] md:text-[2.25rem] font-[500] leading-tight">
            Are you a{" "}
            <span className="font-[600] italic text-[2.25rem] md:text-[3rem] text-[#111]">
              Trip Organizer
            </span>
          </h1>
          <h1 className="text-[1.75rem] md:text-[2.25rem] font-[500] leading-tight">
            or a{" "}
            <span className="font-[600] italic text-[2.25rem] md:text-[3rem] text-[#111]">
              Trip Leader
            </span>
          </h1>
          <h1 className="text-[1.75rem] md:text-[2.25rem] font-[500] leading-tight mb-4 mt-6">
            that organizes fixed departure group trips?
          </h1>

          <div
            className={`${styles.poppins} md:w-[180%] text-[#575757] max-lg:mt-[5rem] lg:w-full z-1`}
          >
            <h2 className="text-[1.5rem] md:text-[2rem] font-[500] py-4">
              We’ve got an offer you’ll love 🧡
            </h2>
            <p className="text-[1rem] md:text-[1.25rem] font-[400]  pt-4">
              At Ragir, we are launching a platform that{" "}
              <span className="font-[600] italic sub-txt tracking-[0.15%]">
                (exclusively)
              </span>{" "}
              lists fixed departure group trips.
            </p>
            <p className="text-[1rem] md:text-[1.25rem] font-[400]  py-5">
              Whether you run treks, expeditions, weekend getaways, creative
              workshops, wellness retreats, cultural tours, or adventure camps,{" "}
              <span className="font-[600] italic sub-txt tracking-[0.15%]">
                Ragir can be your digital partner to build community and
                maximize growth.
              </span>
              <br />
            </p>
            <h2 className="text-[1.75rem] md:text-[2.5rem] font-[500]  poppins pt-2">
              Become one of our first partners and get lifetime perks of being
              our Day 1s
            </h2>
            <div className="max-lg:justify-center flex">
              <Link href="/organizer/join-as-partner" className="max-md:w-full">
                {/* Intentionaly left empty, content set by css for that gradeint text*/}
                <button
                  className={`${styles.btn} text-[1rem] md:text-[1.5rem] rounded-full font-[500] max-md:flex-1 w-full px-6 py-3 mt-8 poppins`}
                ></button>
              </Link>
            </div>
          </div>
        </div>
        <div className="image max-md:mt-4">
          <Image
            src="/prelaunch-page-imgs/hero-1.jpg"
            alt="Hero Image in which a looking for destination"
            width={4000}
            height={2000}
            className=" z-[-1] md:absolute w-[95%]  md:w-[55%] lg:w-[45%] top-40 right-0"
          />
        </div>
      </section>

      {/* Intro Section */}
      <section className="intro_section w-full grid grid-cols-1 md:grid-cols-2 gap-[2rem] md:gap-[5rem] mt-[3rem] md:mt-[5rem]">
        <div className="img order-2 md:order-1 flex justify-center">
          <Image
            src="/prelaunch-page-imgs/intro-hero.webp"
            alt="Image showing travellers having fun"
            width={2412}
            height={1996}
            className="w-[90%] sm:w-[80%] md:w-full h-auto"
          />
        </div>

        <div className="content max-md:text-center order-1 md:order-2">
          <h1
            className={`${styles.barlow} text-[3.5rem] md:text-[4.5rem] font-[700] pb-5  `}
          >
            What is <span className={styles.grad_txt}> Ragir?</span>
          </h1>
          <h2 className="text-[1.25rem] md:text-[1.75rem] text-[#333333] font-[600] italic pt-5">
            Ragir is India’s first search and discovery platform that
            exclusively lists fixed departure group trips.
          </h2>
          <p className=" text-[1rem] md:text-[1.5rem]  font-[400] text-[#575757] pt-4">
            Ragir is designed to showcase your group trips, help you reach the
            right audience, and provide actionable insights to grow your
            business.
          </p>
        </div>
      </section>
    </>
  );
}
