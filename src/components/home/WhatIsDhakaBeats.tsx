"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

function Counter({ end, duration = 2, suffix = "" }: { end: number, duration?: number, suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = end / (duration * 60); // 60fps
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function WhatIsDhakaBeats() {
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

  if (loading) return null;

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 space-y-8"
      >
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
            {settings.about_headline?.split('?')[0]} <span className="text-electric-red">{settings.about_headline?.includes('?') ? '?' : ''}</span>
          </h2>
          {/* Fallback if headline split is tricky */}
          {!settings.about_headline?.includes('?') && (
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
              {settings.about_headline || "What is Dhaka Beats?"}
            </h2>
          )}
          {/* Improved Headline rendering */}
          <h2 className="sr-only">{settings.about_headline}</h2>
          <div className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
             {settings.about_headline?.replace("Dhaka Beats?", "")}
             <span className="text-electric-red">Dhaka Beats?</span>
          </div>

          <div className="w-20 h-1 bg-electric-red" />
        </div>
        
        <p className="text-lg text-white/70 leading-relaxed max-w-xl whitespace-pre-wrap">
          {settings.about_description}
        </p>

        <div className="flex gap-12 pt-4">
          <div className="flex flex-col">
            <span className="text-5xl font-black text-white">
              <Counter end={parseInt(settings.stats_events || "2")} suffix="+" />
            </span>
            <span className="text-xs uppercase tracking-widest text-white/40 font-bold mt-2">Events Organized</span>
          </div>
          <div className="flex flex-col">
            <span className="text-5xl font-black text-white">
              <Counter end={parseInt(settings.stats_visitors || "20000")} suffix="k+" />
            </span>
            <span className="text-xs uppercase tracking-widest text-white/40 font-bold mt-2">Happy Visitors</span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 relative group"
      >
        <div className="aspect-[4/5] rounded-2xl overflow-hidden glass border border-white/10 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center p-12">
            <div className="w-2/3 h-2/3 bg-electric-red/10 rounded-full blur-[80px]" />
            <img src="/logo1.svg" alt="About Dhaka Beats" className="w-32 opacity-20 group-hover:opacity-40 transition-opacity grayscale" />
          </div>
        </div>
        
        <div className="absolute -bottom-6 -left-6 w-32 h-32 glass rounded-2xl border border-white/20 -z-10 shadow-2xl" />
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-electric-red/20 rounded-full blur-[60px] pointer-events-none" />
      </motion.div>
    </section>
  );
}
