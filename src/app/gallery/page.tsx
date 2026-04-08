"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import StarBackground from "@/components/ui/StarBackground";

type GalleryItem = {
  id: string;
  image_url: string;
  category: string;
};

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchGallery = async () => {
      const { data } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (data) setItems(data);
      setLoading(false);
    };

    fetchGallery();
  }, []);

  const categories = ["All", ...Array.from(new Set(items.map(item => item.category)))];
  const filteredItems = activeCategory === "All" 
    ? items 
    : items.filter(item => item.category === activeCategory);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-electric-red/20 border-t-electric-red rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="relative min-h-screen py-32 px-6 overflow-hidden">
      <StarBackground count={40} />
      
      {/* Background Glows */}
      <div className="absolute top-[20%] -right-32 w-[600px] h-[600px] bg-electric-red/5 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] -left-32 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <div className="inline-block px-4 py-1.5 rounded-full border border-electric-red/20 bg-electric-red/5 text-electric-red text-[10px] font-black uppercase tracking-[0.3em]">
              The Visual Pulse
            </div>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">
              Capture <span className="text-white/20">The</span> <span className="text-electric-red">Beat</span>
            </h1>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-end">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-500 ${
                  activeCategory === cat 
                  ? "bg-electric-red border-electric-red text-white shadow-2xl shadow-electric-red/20 scale-105" 
                  : "glass border-white/5 text-white/40 hover:border-white/20 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredItems.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {filteredItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="relative group rounded-[32px] overflow-hidden glass border border-white/5 break-inside-avoid shadow-2xl"
              >
                <img 
                  src={item.image_url} 
                  alt={item.category} 
                  className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-8 text-center backdrop-blur-sm">
                  <div className="space-y-4 translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                    <div className="inline-block px-3 py-1 bg-electric-red rounded-lg text-[8px] font-black uppercase tracking-[0.3em] text-white">
                      {item.category}
                    </div>
                    <div className="h-px w-8 bg-white/20 mx-auto" />
                    <p className="text-white text-xs font-black uppercase tracking-[0.4em] leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                      Moment <span className="text-electric-red">Locked</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center glass rounded-[40px] border border-white/10 border-dashed">
            <p className="text-white/20 uppercase tracking-[.5em] text-sm font-black italic">Memories are still being minted...</p>
          </div>
        )}
      </div>
    </div>
  );
}
