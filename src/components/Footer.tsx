// components/Footer.tsx
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#fde0c7]">
      <div className="flex flex-col items-center justify-center !py-20">
        {/* Flower Icon */}
        <div className="mb-4">
          <Image
            src="/img/co-logo.svg" // put your flower image inside /public
            alt="Flower Icon"
            width={40}
            height={40}
          />
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="flex flex-wrap justify-center gap-6 text-sm !text-black">
            <li>
              <a href="#" className="hover:underline text-black ">
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="hover:underline text-black">
                About Concept
              </a>
            </li>
            <li>
              <a href="#customers" className="hover:underline text-black">
                Happy Customers
              </a>
            </li>
            <li>
              <a href="#about-us" className="hover:underline text-black">
                About Us
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
