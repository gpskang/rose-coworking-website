"use client";
import Image from "next/image";
import { PlayCircle } from "lucide-react";

export default function Customers() {
  const videos = [
    { id: 1, title: "Video Title", desc: "Description", img: "/img/happy.jpg" },
    { id: 2, title: "Video Title", desc: "Description", img: "/img/happy.jpg" },
    { id: 3, title: "Video Title", desc: "Description", img: "/img/happy.jpg" },
    { id: 4, title: "Video Title", desc: "Description", img: "/img/happy.jpg" },
    { id: 5, title: "Video Title", desc: "Description", img: "/img/happy.jpg" },
    { id: 6, title: "Video Title", desc: "Description", img: "/img/happy.jpg" },
  ];

  return (
    <section id="customers" className=" bg-[#f1f9fc] !py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center !mb-5 lg:!text-4xl  !text-3xl !font-semibold !text-[#005865]">
          Our Happy Customers
        </h2>
        <div className="mt-8  grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 lg:!gap-6 !gap-4">
          {videos.map((video, idx) => (
            <div
              key={video.id}
              className={`relative !h-[300px] sm:!h-[400px] w-full overflow-hidden rounded-xl shadow-lg group${idx === videos.length - 1 ? ' lg:hidden' : ''}`}
            >
              <Image
                src={video.img}
                alt={video.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Overlay with play icon */}
              <div className="absolute z-2 top-[50%] rounded-full left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center justify-center bg-black/40  transition">
                <PlayCircle className="!w-12 !h-12 !text-white" />
              </div>
              {/* Title & description */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 via-black/40 to-transparent text-center">
                <h3 className="text-white font-medium !text-sm sm:!text-base">{video.title}</h3>
                <p className="text-gray-200 text-xs">{video.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
