"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, Calendar, Image as ImageIcon, Users, Mail, Home } from "lucide-react";

const navLinks = [
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Gallery", href: "/gallery", icon: ImageIcon },
  { name: "The Team", href: "/the-team", icon: Users },
  { name: "Contact", href: "/contact", icon: Mail },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Navbar (Top Floating) */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden md:block fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl"
      >
        <div className="glass rounded-full px-8 py-4 flex items-center justify-between shadow-md">
          <Link href="/" className="flex items-center">
            {/* The actual image logo is used here instead of text */}
            <img src="/logo1.svg" alt="Dhaka Beats Logo" className="h-10 object-contain" />
          </Link>

          <div className="flex items-center gap-12">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs font-black tracking-[0.4em] transition-all uppercase ${
                    isActive ? "text-electric-red scale-110" : "text-white/40 hover:text-white hover:scale-105"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navbar (Glass Bottom) */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
        <div className="glass rounded-2xl px-6 py-5 flex items-center justify-between relative overflow-visible">
          <div className="absolute inset-0 bg-gradient-to-t from-electric-red/5 to-transparent pointer-events-none rounded-2xl" />
          
          <Link href="/" className={`flex flex-col items-center gap-1.5 z-10 ${pathname === '/' ? 'text-electric-red' : 'text-white/60'}`}>
            <Home size={24} />
            <span className="text-[10px] uppercase font-black tracking-widest">Home</span>
          </Link>
          
          {navLinks.slice(0,3).map((link) => {
             const isActive = pathname === link.href;
             return (
               <Link 
                 key={link.name} 
                 href={link.href}
                 className={`flex flex-col items-center gap-1.5 z-10 ${isActive ? 'text-electric-red' : 'text-white/60'}`}
               >
                 <link.icon size={24} />
                 <span className="text-[10px] uppercase font-black tracking-widest">{link.name}</span>
               </Link>
             )
          })}

          <button onClick={() => setIsOpen(!isOpen)} className="flex flex-col items-center gap-1.5 text-white/60 z-10">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
             <span className="text-[10px] uppercase font-black tracking-widest">More</span>
          </button>
        </div>
        
        {/* Mobile slide-up menu overlay */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-24 left-0 right-0 glass rounded-2xl p-4 flex flex-col gap-4 shadow-lg"
          >
            <Link onClick={() => setIsOpen(false)} href="/contact" className="flex items-center gap-3 text-white/80 p-3 rounded-xl hover:bg-electric-red/10 active:bg-electric-red/10 uppercase tracking-widest text-sm font-semibold">
              <Mail size={18} className="text-electric-red" /> Contact Us
            </Link>
          </motion.div>
        )}
      </nav>
    </>
  );
}
