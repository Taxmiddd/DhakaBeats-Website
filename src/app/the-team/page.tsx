"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Camera, Globe, Share2, Plus } from "lucide-react";
import StarBackground from "@/components/ui/StarBackground";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  image_url: string;
  bio: string;
  instagram_url?: string;
  fb_url?: string;
  linkedin_url?: string;
};

export default function TheTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      const { data } = await supabase
        .from("team")
        .select("*")
        .order("created_at", { ascending: true });
      
      if (data) setTeam(data);
      setLoading(false);
    };

    fetchTeam();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-electric-red/20 border-t-electric-red rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="relative min-h-screen py-32 px-6 overflow-hidden">
      <StarBackground count={40} />
      
      {/* Background Glows */}
      <div className="absolute top-[15%] -left-32 w-[600px] h-[600px] bg-electric-red/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-[15%] -right-32 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-32">
        <div className="max-w-4xl space-y-8 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full border border-electric-red/20 bg-electric-red/5 text-electric-red text-[10px] font-black uppercase tracking-[0.3em]"
          >
            The Collective Intelligence
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85]"
          >
            The <span className="text-electric-red">Pulse</span> <br /> 
            <span className="text-white/20">Behind The</span> Beat
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-xl md:text-2xl leading-relaxed font-light max-w-2xl"
          >
            A curated group of visionaries dedicated to elevating Dhaka&apos;s music landscape into a world-class standard.
          </motion.p>
        </div>

        {team.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {team.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                className="group flex flex-col space-y-8"
              >
                <div className="aspect-[4/5] rounded-[40px] overflow-hidden glass border border-white/5 relative shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
                  
                  {member.image_url ? (
                    <img src={member.image_url} alt={member.name} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-1000 ease-out" />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/5 uppercase text-xs font-black tracking-[1em] rotate-90 whitespace-nowrap">ID ARCHIVED</div>
                  )}
                  
                  {/* Social Overlay on Hover */}
                  <div className="absolute bottom-10 left-10 right-10 z-20 flex gap-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                    {member.instagram_url && (
                      <a href={member.instagram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 hover:scale-110 transition-transform">
                        <img src="/icons/instagram.png" alt="Instagram" className="w-full h-full object-contain" />
                      </a>
                    )}
                    {member.fb_url && (
                      <a href={member.fb_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 hover:scale-110 transition-transform">
                        <img src="/icons/facebook.png" alt="Facebook" className="w-full h-full object-contain" />
                      </a>
                    )}
                    {member.linkedin_url && (
                      <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                        <Share2 size={16} className="text-black" />
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4 px-4">
                  <div className="space-y-1">
                    <p className="text-electric-red text-[10px] font-black uppercase tracking-[0.4em]">{member.role}</p>
                    <h3 className="text-4xl font-black uppercase tracking-tighter group-hover:text-electric-red transition-colors duration-500">{member.name}</h3>
                  </div>
                  <div className="h-px w-12 bg-white/20 group-hover:w-full transition-all duration-700" />
                  <p className="text-white/40 text-sm leading-relaxed font-light line-clamp-3 group-hover:text-white/70 transition-colors duration-500 italic">
                    &quot;{member.bio}&quot;
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center glass rounded-[40px] border border-white/10 border-dashed">
            <p className="text-white/20 uppercase tracking-[.5em] text-sm font-black italic">The collective is expanding...</p>
          </div>
        )}
      </div>
    </div>
  );
}
