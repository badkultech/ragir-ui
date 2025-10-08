import React from "react";
import { Facebook, Linkedin, Instagram } from "lucide-react";

export default function Footer(): React.JSX.Element {
  return (
    <footer className="bg-black text-white p-4 md:px-[5rem] md:py-[1.75rem] flex max-md:gap-4 max-md:flex-col-reverse  justify-between items-center">
      <p className="text-center text-[1rem]">© 2025 Copyright. All rights reserved.</p>
      <div className="flex items-center gap-4">
        <a href="#" aria-label="Follow us on LinkedIn" className="hover:scale-110 transition-transform duration-200">
          <Linkedin size={28} className="text-white hover:text-blue-400" />
        </a>
        <a href="#" aria-label="Follow us on Facebook" className="hover:scale-110 transition-transform duration-200">
          <Facebook size={28} className="text-white hover:text-blue-500" />
        </a>
        <a href="#" aria-label="Follow us on Instagram" className="hover:scale-110 transition-transform duration-200">
          <Instagram size={28} className="text-white hover:text-pink-400" />
        </a>
      </div>
    </footer>
  );
}
