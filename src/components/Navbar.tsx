"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "About Concept", href: "#about" },
  { label: " Happy Customers", href: "#customers" },
  { label: "About Us", href: "#about-us" },
  { label: "Contact Us", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFD5A5] backdrop-blur supports-[backdrop-filter]:bg-[#FFD5A5] border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={'/'} className="flex items-center gap-2">
              <Image src="/img/co-logo.svg" alt="MyStylist" width={28} height={28} />
              <span className="font-semibold text-slate-800">RoSe Co-Working Salon</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-black hover:text-slate-900 transition-colors"
              >
                {item.label}
              </a>
            ))}
            {/* <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-md bg-black   px-4 py-2 text-sm font-medium text-white shadow hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              Join As Co-Working
            </a> */}
          </nav>

          <button
            aria-label="Open menu"
            className="md:hidden inline-flex items-center justify-center rounded-md border px-3 py-2 text-slate-700 hover:bg-slate-50"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="mx-auto max-w-7xl !text-black px-4 py-4 !space-y-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block text-sm font-medium text-black"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
           
          </div>
        </div>
      )}
    </header>
  );
}


