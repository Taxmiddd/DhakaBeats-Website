"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import StarBackground from "@/components/ui/StarBackground";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function Hero() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("site_settings").select("*");
      if (data) {
        const formatted = data.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
        setSettings(formatted);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const headline = settings.hero_headline || "The Pulse of Dhaka";
  const words = headline.split(' ');
  const lastWord = words.pop();
  const mainHeadline = words.join(' ');

  if (loading) return null;

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 pt-20">
      <StarBackground count={20} />
      
      {/* Background Animated Matte Glows */}
      <motion.div 
        animate={{
          scale: [1, 1.1, 1],
          x: ["-50%", "-48%", "-50%"],
          y: ["-50%", "-52%", "-50%"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 w-[80vw] h-[80vw] md:w-[45vw] md:h-[45vw] bg-electric-red/10 rounded-full blur-[140px] pointer-events-none -z-10" 
      />

      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          x: ["0%", "5%", "0%"],
          y: ["0%", "-5%", "0%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 right-1/4 w-[40vw] h-[40vw] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none -z-10" 
      />
      
      <div className="max-w-5xl mx-auto text-center flex flex-col items-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-block mb-6 px-5 py-2 rounded-full glass-red text-electric-red text-xs md:text-sm font-bold tracking-[0.2em] uppercase border border-electric-red/20 shadow-sm"
        >
          One Beat Ahead
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.9] text-white mb-6"
        >
          {mainHeadline} <br />
          <span className="text-electric-red inline-block" style={{ WebkitTextFillColor: '#ea0000', WebkitTextStroke: '1px rgba(234,0,0,0.1)' }}>{lastWord}</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-lg md:text-xl text-white/70 max-w-2xl mb-10 font-light tracking-wide leading-relaxed"
        >
          {settings.hero_subheadline}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
        >
          <Link href="/events" className="group relative px-8 py-4 bg-electric-red text-white text-sm font-bold uppercase tracking-[0.1em] rounded-full overflow-hidden shadow-md transition-all hover:scale-105 hover:bg-red-600 flex items-center justify-center gap-2">
            <span className="relative z-10">Explore Events</span>
            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link href="/gallery" className="px-8 py-4 glass text-white text-sm font-bold uppercase tracking-[0.1em] rounded-full transition-all hover:bg-white/10 hover:border-white/20 flex items-center justify-center">
            View Gallery
          </Link>
        </motion.div>
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none -z-10" />
    </section>
  );
}
