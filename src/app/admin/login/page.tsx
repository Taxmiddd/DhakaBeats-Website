"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass p-8 rounded-3xl border border-white/10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <img src="/logo1.svg" alt="Dhaka Beats" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-black uppercase tracking-widest">Admin Access</h1>
          <p className="text-white/40 text-sm mt-2">Enter your credentials to manage the beat.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 bg-electric-red/10 border border-electric-red/20 rounded-lg text-electric-red text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold tracking-widest text-white/60 ml-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-electric-red transition-all"
              placeholder="admin@dhakabeats.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase font-bold tracking-widest text-white/60 ml-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-electric-red transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-electric-red text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-electric-red/20 flex items-center justify-center"
          >
            {loading ? "Authenticating..." : "Login to Dashboard"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
