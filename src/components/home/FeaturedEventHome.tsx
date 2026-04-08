"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
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

  const getFullDisplayDate = (dateStr: string, endDateStr?: string) => {
    const start = new Date(dateStr);
    const startFormatted = start.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
    
    if (!endDateStr || endDateStr === dateStr) return startFormatted;
    
    const end = new Date(endDateStr);
    const endFormatted = end.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
    
    if (start.getFullYear() === end.getFullYear()) {
      if (start.getMonth() === end.getMonth()) {
        return `${start.toLocaleString('default', { month: 'short' }).toUpperCase()} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
      }
      return `${start.toLocaleString('default', { month: 'short', day: 'numeric' }).toUpperCase()} - ${end.toLocaleString('default', { month: 'short', day: 'numeric' }).toUpperCase()}, ${start.getFullYear()}`;
    }
    
    return `${startFormatted} - ${endFormatted}`;
  };

  if (loading) return (
// ... (rest of the code remains similar, but using the new formatting in the UI)
    <div className="py-24 max-w-7xl mx-auto px-6 animate-pulse">
      <div className="h-[500px] glass rounded-[40px] border border-white/10" />
    </div>
  );
  
  if (!event) return null;

  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <div className="mb-12 text-center md:text-left">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
          Event <span className="text-electric-red">Spotlight</span>
        </h2>
        <p className="text-white/40 uppercase tracking-[0.3em] font-bold text-[10px] mt-2">The beat you can&apos;t miss</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass rounded-[40px] p-8 md:p-16 border border-white/10 relative overflow-hidden group shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-electric-red/10 via-transparent to-transparent -z-10 group-hover:scale-110 transition-transform duration-1000" />
        
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-[55%] aspect-video bg-zinc-900 rounded-[32px] overflow-hidden border border-white/5 relative">
            {event.image_url ? (
              <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            ) : (
              <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/10 uppercase font-black">No Preview</div>
            )}
            {event.price && (
              <div className="absolute top-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-black uppercase text-white border border-white/10">
                {event.price}
              </div>
            )}
          </div>

          <div className="lg:w-[45%] flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-none text-white">{event.title}</h3>
                <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-electric-red pt-2">
                  <span className="flex items-center gap-2"><Calendar size={14} /> {getFullDisplayDate(event.date, event.end_date)}</span>
                  <span className="flex items-center gap-2"><MapPin size={14} /> {event.location}</span>
                </div>
              </div>
              <p className="text-white/60 text-lg leading-relaxed font-light">{event.description}</p>
            </div>
            
            <div className="flex flex-wrap gap-6 pt-4">
              {event.tickets_url ? (
                <a href={event.tickets_url} target="_blank" rel="noopener noreferrer" className="px-10 py-5 bg-electric-red text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-white hover:text-black transition-all shadow-xl shadow-electric-red/20 active:scale-95">
                  Book Access
                </a>
              ) : (
                <button disabled className="px-10 py-5 bg-white/5 text-white/20 text-[10px] font-black uppercase tracking-[0.2em] rounded-full cursor-not-allowed border border-white/5">
                  Coming Soon
                </button>
              )}
              <Link href="/events" className="px-10 py-5 glass text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-white/10 transition-all flex items-center justify-center">
                Full Schedule
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
