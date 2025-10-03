"use client";

import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactUs() {
  const contacts = [
    {
      id: 1,
      title: "EMAIL",
      value: "info@mystylist.in",
      icon: <Mail className="h-5 w-5 text-indigo-900" />,
    },
    {
      id: 2,
      title: "PHONE",
      value: "+91 7070 656 562",
      icon: <Phone className="h-5 w-5 text-indigo-900" />,
    },
    {
      id: 3,
      title: "ADDRESS",
      value: "Plot No. 1278, Spacejam Building, Sector 82, Mohali.",
      icon: <MapPin className="h-5 w-5 text-indigo-900" />,
    },
  ];

  return (
    <section id="contact" className="bg-[#F7FEFF] !py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading */}
        <h2 className="text-center !mb-5 lg:!text-4xl  !text-3xl !font-semibold !text-[#005865] ">
          Contact Us
        </h2>
        <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
          We welcome inquiries from Stylist, business owners, and professional
          advisors. Our team is ready to discuss potential investment
          opportunities.
        </p>

        {/* Contact Cards */}
        <div className="!mt-10 !space-y-4">
          {contacts.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-lg border border-indigo-100 bg-white px-5 py-3 shadow-sm text-left"
            >
              {/* Icon */}
              <div className="flex h-10 w-10 items-center justify-center rounded-md  ">
                {item.icon}
              </div>

              {/* Text */}
              <div className="   flex gap-1 flex-col items-start  " >
                <div className="!text-xs font-semibold text-slate-700 ">
                  {item.title}
                </div>
                <div className="!text-sm text-slate-800">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
