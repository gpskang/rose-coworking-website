import Image from "next/image";
import BookingCard from "@/components/BookingCard";
import AboutConcept from "@/components/AboutSection"
import CustomersSection from "@/components/Customers"
import ContactUs from "@/components/ContactUs"
import AboutUs from "@/components/AboutUs"
export default function Page() {
  return (
    <main className="min-h-screen flex flex-col bg-white">

      {/* Hero */}
      <section className="relative lg:min-h-[600px] flex items-center justify-center  isolate overflow-hidden ">
        <div className=" absolute top-0 z-0 left-0 w-full h-full  ">
          <div className=" w-full h-full  relative ">
            <Image src={'/img/hero_bg_co.jpg'} fill alt="mystylist coworking" className=" object-top " objectFit="cover" />
          </div>
        </div>
        <div className="mx-auto lg:w-[85%] relative z-1 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 py-12 sm:py-16 lg:py-20">
            <div>
              <h1 className=" lg:!text-6xl md:!text-5xl  !text-3xl font-bold leading-tight text-black">
                Your Co-Working
                <br />
                Partner
              </h1>

            </div>

            {/* Booking/OTP widget */}
            <div className="justify-self-start  lg:w-[450px] lg:justify-self-end">
              <BookingCard />
            </div>
          </div>
        </div>
      </section>

      {/* About Concept */}
      <AboutConcept />

      {/* Customers */}
      <CustomersSection />

      {/* About Us */}
      <AboutUs />

      {/* Contact */}
     <ContactUs/>

    </main>
  );
}


