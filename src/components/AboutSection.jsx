"use client";

import * as React from "react";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";

export default function AboutConcept() {
    const levels = [
        {
            id: 1,
            title: "Level 1",
            desc: "Lorem ipsum dolor sit amet consectetur. Vestibulum netus nunc non felis iaculis sed dis nunc. Lectus posuere mauris odio lorem pellentesque donec rhoncus.",
            images: [
                "/img/showcase1.png",
                "/img/showcase2.png",
                "/img/showcase3.png",
                "/img/showcase4.png",
            ],
        },
        {
            id: 2,
            title: "Level 2",
            desc: "At mauris lorem venenatis interdum blandit commodo mi in. Pulvinar pellentesque ornare praesent ultrices cursus.",
            images: [
                "/img/showcase2.png",
                "/img/showcase3.png",
                "/img/showcase4.png",
                "/img/showcase1.png",
            ],
        },
        {
            id: 3,
            title: "Level 3",
            desc: "Lorem ipsum dolor sit amet consectetur. Vestibulum netus nunc non felis iaculis sed dis nunc. Lectus posuere mauris odio lorem pellentesque donec rhoncus.",
            images: [
                "/img/showcase3.png",
                "/img/showcase4.png",
                "/img/showcase1.png",
                "/img/showcase2.png",
            ],
        },
    ];

    return (

        <section id="about" className="bg-white mx-auto lg:w-[70%] md:w-[85%] w-[95%] !py-10 ">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-center mb-5 lg:!text-4xl  !text-3xl !font-semibold !text-[#005865]">
                    About Concept </h2>

                <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {levels.map((level) => (
                        <Card
                            key={level.id}
                            className="rounded-xl bg-white shadow border !border-[#C0F9FF] !p-0 overflow-hidden"
                        >
                            <CardContent className="!px-2 !pt-2">
                                {/* Image Carousel inside each card */}
                                <Carousel opts={{ loop: true }} className="w-full">
                                    <CarouselContent>
                                        {level.images.map((img, idx) => (
                                            <CarouselItem key={idx}>
                                                <div className="relative h-[250px] w-full">
                                                    <Image
                                                        src={img}
                                                        alt={`${level.title} image ${idx + 1}`}
                                                        fill
                                                        className="object-cover rounded-md"
                                                    />
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>

                                    {/* Dots (pagination) */}
                                    <div className="flex justify-center gap-2 mt-2 ">
                                        {level.images.map((_, idx) => (
                                            <span
                                                key={idx}
                                                className="h-2 w-2 rounded-full bg-slate-300 data-[active=true]:bg-slate-700"
                                                data-active={idx === 0}
                                            />
                                        ))}
                                    </div>
                                </Carousel>
                            </CardContent>

                            <CardHeader className="!px-3 !pb-3 ">
                                <CardTitle className="text-slate-800 font-semibold">
                                    {level.title}
                                </CardTitle>
                                <CardDescription className="text-slate-600 text-sm !mt-2">
                                    {level.desc}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

    );
}
