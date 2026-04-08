"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Service = {
  id: string;
  title: string;
  description: string;
  icon_url: string;
};

export default function OurServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from("services").select("*").order("created_at", { ascending: true });
      if (data) setServices(data);
      setLoading(false);
    };
    fetchServices();
  }, []);

  if (loading) return null;
  if (services.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
            Our <span className="text-electric-red">Services</span>
          </h2>
          <p className="text-white/40 uppercase tracking-[0.3em] font-bold text-xs">Excellence in every beat</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-2xl border border-white/10 hover:border-electric-red/30 transition-all group"
            >
              <div className="w-16 h-16 mb-6 group-hover:scale-110 transition-transform duration-500">
                <img 
                  src={service.icon_url || "/icons/instagram.png"} 
                  alt={service.title} 
                  className="w-full h-full object-contain" 
                />
              </div>
              <h3 className="text-xl font-bold uppercase mb-4 tracking-wider">{service.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
