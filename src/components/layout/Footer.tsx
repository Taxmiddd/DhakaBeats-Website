import Link from "next/link";
import { Camera, Globe, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 relative overflow-hidden pb-24 md:pb-12">
      {/* Decorative Matte Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-electric-red/30 to-transparent" />
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-1/2 h-10 bg-electric-red blur-[120px] opacity-10" />
      
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center text-center gap-10">
        <div className="flex flex-col items-center gap-8">
          <Link href="/" className="flex items-center">
            <img src="/logo2.svg" alt="Dhaka Beats Logo" className="h-32 md:h-40 object-contain" />
          </Link>
          <p className="text-white/50 text-sm tracking-[0.5em] uppercase font-bold">One Beat Ahead.</p>
        </div>

        <div className="flex gap-8">
          <Link href="#" className="w-12 h-12 hover:scale-110 transition-transform">
            <img src="/icons/instagram.png" alt="Instagram" className="w-full h-full object-contain" />
          </Link>
          <Link href="#" className="w-12 h-12 hover:scale-110 transition-transform">
            <img src="/icons/facebook.png" alt="Facebook" className="w-full h-full object-contain" />
          </Link>
          <Link href="mailto:hello@dhakabeats.com" className="w-12 h-12 hover:scale-110 transition-transform">
            <img src="/icons/email.png" alt="Email" className="w-full h-full object-contain" />
          </Link>
        </div>
      </div>
      
      <div className="border-t border-white/5 py-10 flex flex-col items-center gap-4">
        <p className="text-sm text-white/50 tracking-wider">
          © 2026 Dhaka Beats. All rights reserved.
        </p>
        <a 
          href="https://noeticstudio.net" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-1"
        >
          <span className="text-[10px] text-white/30 tracking-[0.2em] uppercase">Developed by</span>
          <span className="text-sm text-white/60 font-semibold tracking-widest uppercase group-hover:text-electric-red transition-colors">
            Noetic Studio
          </span>
        </a>
      </div>
    </footer>
  );
}
