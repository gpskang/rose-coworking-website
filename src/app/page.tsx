"use client";

import Image from "next/image";
import BookingCard from "@/components/BookingCard";
import AboutConcept from "@/components/AboutSection"
import CustomersSection from "@/components/Customers"
import ContactUs from "@/components/ContactUs"
import AboutUs from "@/components/AboutUs"
import { motion } from "framer-motion";
export default function Page() {
  return (
    <main className="min-h-screen flex flex-col bg-white">

      {/* Hero */}
      <section className="relative lg:min-h-[600px] flex items-center justify-center isolate overflow-hidden">
        {/* Background Image with Animation */}
        <motion.div 
          className="absolute top-0 z-0 left-0 w-full h-full"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="w-full h-full relative">
            <Image 
              src={'/img/hero_bg_co.jpg'} 
              fill 
              alt="mystylist coworking" 
              className="object-top" 
              objectFit="cover" 
            />
          </div>
        </motion.div>

        {/* Content Container */}
        <div className="mx-auto lg:w-[85%] relative z-1 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 py-12 sm:py-16 lg:py-20">
            
            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="text-center lg:text-left"
            >
              <motion.h1 
                className="lg:!text-6xl md:!text-5xl !text-3xl font-bold leading-tight text-black"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  Your Co-Working
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="text-teal-600"
                >
                  Partner
                </motion.span>
              </motion.h1>

            
            </motion.div>

            {/* Booking Card with Animation */}
            <motion.div 
              className="justify-self-center lg:w-[450px] lg:justify-self-end"
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ 
                duration: 0.8, 
                ease: "easeOut", 
                delay: 0.4,
                type: "spring",
                stiffness: 100
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="relative"
              >
                <BookingCard />
                
              </motion.div>
            </motion.div>
          </div>
        </div>

      
        
      </section>

      {/* About Concept */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <AboutConcept />
      </motion.div>

      {/* Customers */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <CustomersSection />
      </motion.div>

      {/* About Us */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <AboutUs />
      </motion.div>

      {/* Contact */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <ContactUs />
      </motion.div>

    </main>
  );
}


