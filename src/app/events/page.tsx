"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Calendar, MapPin, Ticket, ArrowUpRight, Plus } from "lucide-react";
import StarBackground from "@/components/ui/StarBackground";

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

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: false }); // Show newest/upcoming first in listing
      
      if (data) setEvents(data);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const highlightedEvents = events.filter(e => e.is_highlight);
  const timelineEvents = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatTimelineDate = (dateStr: string, endDateStr?: string) => {
    const start = new Date(dateStr);
    const month = start.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = start.getFullYear().toString().slice(-2);
    
    if (!endDateStr || endDateStr === dateStr) {
      return { month, year, dayRange: start.getDate() };
    }

    const end = new Date(endDateStr);
    const endMonth = end.toLocaleString('default', { month: 'short' }).toUpperCase();
    
    if (month === endMonth) {
      return { month, year, dayRange: `${start.getDate()} - ${end.getDate()}` };
    }
    
    return { month: `${month} - ${endMonth}`, year, dayRange: `${start.getDate()} - ${end.getDate()}` };
  };

  const getFullDisplayDate = (dateStr: string, endDateStr?: string) => {
    const start = new Date(dateStr);
    const startFormatted = start.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
    
    if (!endDateStr || endDateStr === dateStr) return startFormatted;
    
    const end = new Date(endDateStr);
    const endFormatted = end.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
    
    // Check if same year/month to simplify
    if (start.getFullYear() === end.getFullYear()) {
      if (start.getMonth() === end.getMonth()) {
        return `${start.toLocaleString('default', { month: 'short' }).toUpperCase()} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
      }
      return `${start.toLocaleString('default', { month: 'short', day: 'numeric' }).toUpperCase()} - ${end.toLocaleString('default', { month: 'short', day: 'numeric' }).toUpperCase()}, ${start.getFullYear()}`;
    }
    
    return `${startFormatted} - ${endFormatted}`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-electric-red/20 border-t-electric-red rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="relative min-h-screen py-32 px-6 overflow-hidden">
      <StarBackground count={40} />
      
      {/* Background Glows */}
      <div className="absolute top-[10%] -left-32 w-[600px] h-[600px] bg-electric-red/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] -right-32 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-40">
        {/* FLAGSHIP Section */}
        {highlightedEvents.length > 0 && (
          <div className="space-y-16">
            <div className="text-center md:text-left space-y-4">
              <div className="inline-block px-4 py-1.5 rounded-full border border-electric-red/20 bg-electric-red/5 text-electric-red text-[10px] font-black uppercase tracking-[0.3em]">
                The Main Stages
              </div>
              <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none">
                Flagship <br /> <span className="text-electric-red">Experiences</span>
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {highlightedEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative glass rounded-[40px] overflow-hidden border border-white/10 aspect-[16/10] shadow-2xl"
                >
                  <img src={event.image_url} alt="" className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 opacity-80" />
                  
                  <div className="absolute inset-0 p-10 flex flex-col justify-end z-20 space-y-6">
                    <div className="space-y-2">
                      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-electric-red">{getFullDisplayDate(event.date, event.end_date)}</div>
                      <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">{event.title}</h2>
                    </div>
                    
                    {event.tickets_url ? (
                      <a href={event.tickets_url} target="_blank" rel="noopener noreferrer" className="w-fit px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-electric-red hover:text-white transition-all scale-0 group-hover:scale-100 origin-left duration-500">
                        Discover Access
                      </a>
                    ) : (
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">Announcing Details Soon</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* TIMELINE Section */}
        <div className="space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                Experience <br /><span className="text-white/20">Timeline</span>
              </h2>
            </div>
            <p className="text-white/40 uppercase tracking-[0.3em] font-bold text-[10px] max-w-xs text-right hidden md:block leading-loose">
              Every beat, every moment. <br />Past, Present & Future.
            </p>
          </div>

          <div className="space-y-0">
            {timelineEvents.map((event, i) => {
              const { month, year, dayRange } = formatTimelineDate(event.date, event.end_date);
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="group relative border-b border-white/5 py-12 md:py-16 flex flex-col md:flex-row items-start md:items-center gap-10 hover:bg-white/[0.02] transition-colors"
                >
                  {/* Date Badge */}
                  <div className="flex flex-row md:flex-col items-baseline gap-2 md:gap-0 shrink-0 min-w-24">
                    <span className="text-3xl md:text-4xl font-black tracking-tighter text-white/20 group-hover:text-electric-red transition-colors duration-500">{month}</span>
                    <div className="flex gap-2 items-baseline">
                      <span className="text-xl md:text-2xl font-black tracking-tighter text-white group-hover:text-white transition-colors duration-500">{dayRange}</span>
                      <span className="text-sm font-black tracking-tighter text-white/10 uppercase">{year}</span>
                    </div>
                  </div>

                  {/* Core Info */}
                  <div className="flex-grow space-y-2 md:space-y-0">
                    <h3 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none group-hover:text-white transition-colors duration-500">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-6 mt-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                      <span className="flex items-center gap-2"><MapPin size={12} className="text-electric-red" /> {event.location}</span>
                      {event.price && <span className="flex items-center gap-2"><Ticket size={12} className="text-electric-red" /> {event.price}</span>}
                    </div>
                  </div>

                  {/* CTA */}
                  {event.tickets_url ? (
                    <a href={event.tickets_url} target="_blank" rel="noopener noreferrer" className="w-16 h-16 md:w-20 md:h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/40 group-hover:bg-electric-red group-hover:text-white group-hover:border-electric-red transition-all duration-500 -rotate-45 group-hover:rotate-0">
                      <ArrowUpRight size={28} />
                    </a>
                  ) : (
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 border border-white/5 rounded-full flex items-center justify-center text-white/10 cursor-not-allowed">
                       <Plus size={24} className="rotate-45" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
