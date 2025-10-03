"use client";
import Image from "next/image";

export default function AboutUs() {
  return (
    <section id="about-us" className=" !py-10">
      <div className="mx-auto  max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center mb-7 lg:!text-4xl  !text-3xl !font-semibold !text-[#005865] ">
          About Us
        </h2>
        <div className="grid  grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div>
            <h3 className="!text-xl sm:!text-2xl font-semibold text-slate-900">
              MyStylist is the Game Changer
            </h3>
            <p className="mt-4 text-slate-600 leading-relaxed">
              We are building a vibrant community where professionals meet, work
              and grow together. Thoughtfully designed environments, reliable
              internet and helpful staff make your day productive.
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Choose flexible passes or monthly memberships tailored for
              freelancers, startups and teams.
            </p>
          </div>

          {/* Right Image */}
          <div className="relative h-56 sm:h-72 md:h-80 lg:h-96 w-full overflow-hidden rounded-xl shadow-lg">
            <Image
              src="/img/about_us.jpg"
              alt="workspace"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
