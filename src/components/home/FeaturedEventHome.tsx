"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  end_date?: string;
  location: string;
  image_url: string;
  is_highlight: boolean;
  price?: string;
  tickets_url?: string;
};

export default function FeaturedEventHome() {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHighlight = async () => {
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("is_highlight", true)
        .order("date", { ascending: false })
        .limit(1);
      
      if (data && data.length > 0) setEvent(data[0]);
      setLoading(false);
    };

    fetchHighlight();
  }, []);

  const getDayOnly = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.getDate();
  };

  const getMonthYear = (dateStr: string) => {
    const d = new Date(dateStr);
    const month = d.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = d.getFullYear().toString().slice(-2);
    return { month, year };
  };

  if (loading || !event) return null;

  const { month, year } = getMonthYear(event.date);
  
  // Title Split Logic for Rishka Style (Last word in red)
  const words = event.title.split(" ");
  const lastWord = words.pop();
  const firstPart = words.join(" ");

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden py-24 transform-gpu">
      {/* Background Cinematic Treatment - Optimized for Performance */}
      <div className="absolute inset-0 z-0 will-change-transform">
        <img 
          src={event.image_url} 
          className="w-full h-full object-cover grayscale opacity-40 scale-100 transition-transform duration-[2000ms] ease-out will-change-transform" 
          alt="" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black/60 pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full transform-gpu">
        <div className="flex flex-col items-center text-center space-y-12">
          
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="px-6 py-2 rounded-full border border-white/10 glass text-[10px] font-black uppercase tracking-[0.4em] text-white/40"
          >
            Featured Spotlight
          </motion.div>

          <div className="relative w-full">
            {/* Symmetric Metadata (Desktop) */}
            <div className="hidden lg:flex absolute inset-x-0 top-1/2 -translate-y-1/2 justify-between items-center pointer-events-none transform-gpu">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-start space-y-2"
              >
                <div className="flex items-center gap-2 text-electric-red">
                  <MapPin size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Location</span>
                </div>
                <span className="text-xl font-black uppercase tracking-tighter text-white">{event.location}</span>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-end space-y-2"
              >
                <div className="flex items-center gap-2 text-electric-red">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Timeline</span>
                  <Calendar size={16} />
                </div>
                <span className="text-xl font-black uppercase tracking-tighter text-white">
                  {month} {getDayOnly(event.date)} &apos;{year}
                </span>
              </motion.div>
            </div>

            {/* Main Headline - Optimized rendering */}
            <motion.h2
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-7xl md:text-9xl lg:text-[11rem] font-black uppercase tracking-tighter leading-none text-white drop-shadow-2xl will-change-transform"
            >
              {firstPart} <br className="hidden md:block" />
              <span className="text-electric-red inline-block transform-gpu" style={{ WebkitTextFillColor: '#ea0000' }}>
                {lastWord}
              </span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="max-w-xl space-y-10"
          >
            <p className="text-lg md:text-xl text-white/60 font-medium leading-relaxed tracking-wide italic">
               &quot;{event.description}&quot;
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {event.tickets_url ? (
                <a 
                  href={event.tickets_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-12 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-full hover:bg-electric-red hover:text-white transition-all transform hover:scale-105 transform-gpu"
                >
                  Book Access
                </a>
              ) : (
                <div className="px-12 py-5 border border-white/10 glass text-[10px] font-black uppercase tracking-[0.4em] text-white/40 rounded-full">
                  Access Opening Soon
                </div>
              )}
              
              <Link 
                href="/events" 
                className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white hover:text-electric-red transition-colors"
              >
                View Schedule 
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-electric-red group-hover:bg-electric-red transition-all transform-gpu">
                  <ArrowRight size={16} />
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Side Glowing Orbs - Simplified for performance */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-electric-red/10 rounded-full blur-[100px] pointer-events-none opacity-50" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-[100px] pointer-events-none opacity-50" />
    </section>

  );
}
