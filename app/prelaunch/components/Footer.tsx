import React from "react";
// import { FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer(): React.JSX.Element {
  return (
    <footer className="bg-black text-white px-[4rem] py-[1.75rem] flex justify-between items-center">
      <p className="text-center text-[1.05rem]">© 2025 Copyright. All rights reserved.</p>
      <div className="flex items-center gap-4">
        <a href="#" aria-label="Follow us on LinkedIn" className="hover:scale-110 transition-transform duration-200">
          {/* <FaLinkedin size={28} className="text-white hover:text-blue-400" /> */}
        </a>
        <a href="#" aria-label="Follow us on Facebook" className="hover:scale-110 transition-transform duration-200">
          {/* <FaFacebook size={28} className="text-white hover:text-blue-500" /> */}
        </a>
        <a href="#" aria-label="Follow us on Instagram" className="hover:scale-110 transition-transform duration-200">
          {/* <FaInstagram size={28} className="text-white hover:text-pink-400" /> */}
        </a>
      </div>
    </footer>
  );
}
