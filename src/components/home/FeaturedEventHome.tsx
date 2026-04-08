"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  end_date?: string;
  location: string;
  image_url: string;
  is_highlight: boolean;
  is_concluded: boolean;
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
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden py-24 transform-gpu [transform:translateZ(0)]">
      {/* Background Cinematic Treatment - Optimized for Performance */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={event.image_url} 
          fill
          className={`object-cover ${event.is_concluded ? 'grayscale opacity-30' : 'grayscale opacity-40'}`} 
          alt={event.title}
          quality={75}
          priority
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
            className={`px-6 py-2 rounded-full border glass text-[10px] font-black uppercase tracking-[0.4em] ${event.is_concluded ? 'border-white/5 text-white/20' : 'border-white/10 text-white/40'}`}
          >
            {event.is_concluded ? "Concluded Spotlight" : "Featured Spotlight"}
          </motion.div>

          <div className="w-full max-w-7xl mx-auto">
            <div className="flex flex-col xl:flex-row items-center justify-between gap-12 xl:gap-6">
              
              {/* Left Metadata - Desktop Side, Mobile Top */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center xl:items-start space-y-2 order-2 xl:order-1 min-w-[200px]"
              >
                <div className="flex items-center gap-2 text-electric-red">
                  <MapPin size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">Location</span>
                </div>
                <span className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white text-center xl:text-left leading-tight">
                  {event.location}
                </span>
              </motion.div>

              {/* Central Headline Area */}
              <div className="flex-1 text-center order-1 xl:order-2 z-20">
                <motion.h2
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-6xl md:text-8xl xl:text-[clamp(5rem,8vw,10rem)] font-black uppercase tracking-tighter leading-[0.85] text-white drop-shadow-2xl will-change-transform"
                >
                  <div className="relative inline-block whitespace-nowrap">
                    {firstPart} {lastWord !== "" && <span className="text-electric-red">{lastWord}</span>}
                    
                    {event.is_concluded && (
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                        <span className="px-5 py-2 rounded-full border border-white/10 bg-black/80 backdrop-blur-md text-[8px] font-black tracking-[0.4em] text-white/40 whitespace-nowrap">
                          PAST EXPERIENCE
                        </span>
                      </div>
                    )}
                  </div>
                </motion.h2>
              </div>

              {/* Right Metadata - Desktop Side, Mobile Top */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center xl:items-end space-y-2 order-3 min-w-[200px]"
              >
                <div className="flex items-center gap-2 text-electric-red">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">Timeline</span>
                  <Calendar size={16} />
                </div>
                <span className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white text-center xl:text-right leading-tight">
                  {month} {getDayOnly(event.date)} &apos;{year}
                </span>
              </motion.div>

            </div>
          </div>

          {/* Description & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto space-y-10 group"
          >
            <p className="text-lg md:text-xl text-white/60 font-medium leading-relaxed tracking-wide italic px-4">
               &quot;{event.description}&quot;
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {event.tickets_url ? (
                <a 
                  href={event.tickets_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-12 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-full hover:bg-electric-red hover:text-white transition-all transform hover:scale-105 transform-gpu shadow-2xl shadow-white/5"
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
                className="group/link flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white hover:text-electric-red transition-colors"
              >
                View Schedule 
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover/link:border-electric-red group-hover/link:bg-electric-red transition-all transform-gpu">
                  <ArrowRight size={16} />
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Side Glowing Orbs - Optimized Gradients */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-[radial-gradient(circle,rgba(234,0,0,0.1)_0%,transparent_70%)] pointer-events-none opacity-50" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none opacity-50" />
    </section>
  );
}
