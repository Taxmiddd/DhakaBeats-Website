"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Camera, Globe, Share2 } from "lucide-react";
import StarBackground from "@/components/ui/StarBackground";

export default function ContactPage() {
  return (
    <div className="relative min-h-screen pt-32 pb-24 px-6 overflow-hidden">
      <StarBackground count={30} />
      
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-electric-red/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full border border-electric-red/20 bg-electric-red/5 text-electric-red text-[10px] font-black uppercase tracking-[0.3em]"
          >
            Connect With The Beat
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter"
          >
            Get In <span className="text-electric-red">Touch</span>
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Info Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 space-y-12"
          >
            <div className="space-y-8">
              <h2 className="text-2xl font-bold uppercase tracking-tight">Contact <span className="text-white/40">Information</span></h2>
              
              <div className="space-y-6">
                <div className="flex gap-6 group">
                  <div className="w-14 h-14 shrink-0 transition-transform group-hover:scale-110">
                    <img src="/icons/email.png" alt="Email" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Email Us</p>
                    <p className="text-xl font-bold text-white group-hover:text-electric-red transition-colors">hello@dhakabeats.com</p>
                    <p className="text-xs text-white/40 mt-1">For inquiries & bookings</p>
                  </div>
                </div>
                
                <div className="flex gap-6 group">
                  <div className="w-14 h-14 bg-electric-red rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-electric-red/20 group-hover:scale-110 transition-transform">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Call Us</p>
                    <p className="text-xl font-bold text-white group-hover:text-electric-red transition-colors">+880 1XXX XXXXXX</p>
                    <p className="text-xs text-white/40 mt-1">Mon - Fri, 10am - 6pm</p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="w-14 h-14 bg-electric-red rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-electric-red/20 group-hover:scale-110 transition-transform">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Visit Us</p>
                    <p className="text-xl font-bold text-white group-hover:text-electric-red transition-colors">Dhaka, Bangladesh</p>
                    <p className="text-xs text-white/40 mt-1">The heart of the city</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white/40">Follow The Pulse</h3>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 hover:scale-110 transition-transform">
                  <img src="/icons/instagram.png" alt="Instagram" className="w-full h-full object-contain" />
                </a>
                <a href="#" className="w-10 h-10 hover:scale-110 transition-transform">
                  <img src="/icons/facebook.png" alt="Facebook" className="w-full h-full object-contain" />
                </a>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                  <Share2 size={16} className="text-black" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="glass p-8 md:p-12 rounded-[40px] border border-white/10 shadow-3xl">
              <form className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1 group-focus-within:text-electric-red transition-colors">Your Name</label>
                    <input 
                      type="text" 
                      placeholder="JOHN DOE"
                      className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-electric-red transition-all placeholder:text-white/5 uppercase font-bold tracking-widest text-sm" 
                    />
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1 group-focus-within:text-electric-red transition-colors">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="HELLO@COMPANY.COM"
                      className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-electric-red transition-all placeholder:text-white/5 uppercase font-bold tracking-widest text-sm" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1 group-focus-within:text-electric-red transition-colors">Phone Number</label>
                    <input 
                      type="text" 
                      placeholder="+880..."
                      className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-electric-red transition-all placeholder:text-white/5 uppercase font-bold tracking-widest text-sm" 
                    />
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1 group-focus-within:text-electric-red transition-colors">Subject</label>
                    <input 
                      type="text" 
                      placeholder="EVENT INQUIRY"
                      className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-electric-red transition-all placeholder:text-white/5 uppercase font-bold tracking-widest text-sm" 
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1 group-focus-within:text-electric-red transition-colors">Your Message</label>
                  <textarea 
                    rows={4} 
                    placeholder="HOW CAN WE HELP YOU?"
                    className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-electric-red transition-all placeholder:text-white/5 uppercase font-bold tracking-widest text-sm resize-none" 
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-6 bg-electric-red text-white text-xs font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-electric-red/20 hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
                >
                  Send Message <Send size={16} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
