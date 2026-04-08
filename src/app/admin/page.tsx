"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, Edit2, Star, Image as ImageIcon, Users, 
  Calendar, LogOut, Camera, Globe, Share2, 
  ExternalLink, DollarSign
} from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

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
  status: "published" | "draft";
};

type GalleryItem = {
  id: string;
  image_url: string;
  category: string;
};

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

type Service = {
  id: string;
  title: string;
  description: string;
  icon_url: string;
};

type SiteSetting = {
  id: string;
  key: string;
  value: string;
};

export default function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"events" | "gallery" | "team" | "services" | "settings">("events");
  
  // Data States
  const [events, setEvents] = useState<Event[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  
  // UI States
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const router = useRouter();

  // Unified Form Data State
  const [eventForm, setEventForm] = useState<Partial<Event>>({
    title: "", description: "", date: "", end_date: "", location: "", image_url: "", 
    is_highlight: false, price: "", tickets_url: "", status: "published"
  });

  const [galleryForm, setGalleryForm] = useState<Partial<GalleryItem>>({
    image_url: "", category: "General"
  });

  const [teamForm, setTeamForm] = useState<Partial<TeamMember>>({
    name: "", role: "", image_url: "", bio: "",
    instagram_url: "", fb_url: "", linkedin_url: ""
  });

  const [serviceForm, setServiceForm] = useState<Partial<Service>>({
    title: "", description: "", icon_url: ""
  });

  const [settingsForm, setSettingsForm] = useState<Record<string, string>>({});

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
      } else {
        setSession(session);
        refreshData();
      }
      setLoading(false);
    };
    checkSession();
  }, [router, activeTab]);

  const refreshData = () => {
    if (activeTab === "events") fetchEvents();
    if (activeTab === "gallery") fetchGallery();
    if (activeTab === "team") fetchTeam();
    if (activeTab === "services") fetchServices();
    if (activeTab === "settings") fetchSettings();
  };

  const fetchEvents = async () => {
    const { data } = await supabase.from("events").select("*").order("date", { ascending: true });
    if (data) setEvents(data);
  };

  const fetchGallery = async () => {
    const { data } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
    if (data) setGallery(data);
  };

  const fetchTeam = async () => {
    const { data } = await supabase.from("team").select("*").order("created_at", { ascending: true });
    if (data) setTeam(data);
  };

  const fetchServices = async () => {
    const { data } = await supabase.from("services").select("*").order("created_at", { ascending: true });
    if (data) setServices(data);
  };

  const fetchSettings = async () => {
    const { data } = await supabase.from("site_settings").select("*");
    if (data) {
      setSettings(data);
      const formatted = data.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
      setSettingsForm(formatted);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let error;

      if (activeTab === "events") {
        if (editingItem) {
          const { error: err } = await supabase.from("events").update(eventForm).eq("id", editingItem.id);
          error = err;
        } else {
          const { error: err } = await supabase.from("events").insert([eventForm]);
          error = err;
        }
      } else if (activeTab === "gallery") {
        if (editingItem) {
          const { error: err } = await supabase.from("gallery").update(galleryForm).eq("id", editingItem.id);
          error = err;
        } else {
          const { error: err } = await supabase.from("gallery").insert([galleryForm]);
          error = err;
        }
      } else if (activeTab === "team") {
        if (editingItem) {
          const { error: err } = await supabase.from("team").update(teamForm).eq("id", editingItem.id);
          error = err;
        } else {
          const { error: err } = await supabase.from("team").insert([teamForm]);
          error = err;
        }
      } else if (activeTab === "services") {
        if (editingItem) {
          const { error: err } = await supabase.from("services").update(serviceForm).eq("id", editingItem.id);
          error = err;
        } else {
          // Remove ID if present to prevent conflict during creation
          const { id, ...data } = serviceForm as any;
          const { error: err } = await supabase.from("services").insert([data]);
          error = err;
        }
      } else if (activeTab === "settings") {
        const settingsArray = Object.entries(settingsForm).map(([key, value]) => ({ key, value }));
        const { error: err } = await supabase
          .from("site_settings")
          .upsert(settingsArray, { onConflict: "key" });
        error = err;
        
        if (!error) {
          alert("Site CMS Updated Successfully! ✨");
          return refreshData();
        }
      }

      if (error) throw error;

      setShowModal(false);
      setEditingItem(null);
      refreshData();
      alert(`Successfully saved ${activeTab.slice(0, -1)}!`);
    } catch (err: any) {
      console.error("Management Error:", err);
      alert("Error: " + (err.message || "Failed to save changes. Check console for details."));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await supabase.from(activeTab).delete().eq("id", id);
      refreshData();
    }
  };

  const handleToggleHighlight = async (id: string, currentStatus: boolean) => {
    await supabase.from("events").update({ is_highlight: !currentStatus }).eq("id", id);
    fetchEvents();
  };

  if (loading || !session) return null;

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Admin <span className="text-electric-red">Dashboard</span></h1>
          <p className="text-white/40 uppercase tracking-widest text-xs font-bold mt-2">Professional Content Management</p>
        </div>
        <button onClick={() => { supabase.auth.signOut(); router.push("/admin/login"); }} className="flex items-center gap-2 text-white/60 hover:text-electric-red transition-colors text-sm font-bold uppercase tracking-widest">
           <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="flex gap-4 p-1 glass rounded-2xl mb-12 border border-white/5 w-fit overflow-x-auto">
        {[
          { id: "events", icon: Calendar, label: "Events" },
          { id: "gallery", icon: ImageIcon, label: "Gallery" },
          { id: "team", icon: Users, label: "Team" },
          { id: "services", icon: Edit2, label: "Services" },
          { id: "settings", icon: Globe, label: "Site CMS" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.id ? "bg-electric-red text-white shadow-lg shadow-electric-red/20" : "text-white/40 hover:text-white"
            }`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="glass rounded-3xl border border-white/10 p-8 min-h-[500px]">
        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold uppercase tracking-wider">Manage Events</h2>
              <button onClick={() => { setEditingItem(null); setEventForm({ status: "published", is_highlight: false }); setShowModal(true); }} className="bg-white text-black px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-electric-red hover:text-white transition-all">
                <Plus size={16} className="inline mr-2" /> New Event
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {events.map(event => (
                <div key={event.id} className="bg-white/5 border border-white/5 p-6 rounded-2xl flex items-center justify-between group">
                  <div className="flex items-center gap-6">
                    <img src={event.image_url || "/logo1.svg"} className="w-16 h-16 rounded-xl object-cover bg-black" alt="" />
                    <div>
                      <h3 className="font-bold uppercase flex items-center gap-2">{event.title} {event.is_highlight && <Star size={14} className="fill-yellow-500 text-yellow-500" />}</h3>
                      <p className="text-white/40 text-xs uppercase tracking-widest">{event.date} • {event.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleToggleHighlight(event.id, event.is_highlight)} className={`p-2 rounded-lg transition-colors ${event.is_highlight ? 'text-yellow-500 bg-yellow-500/10' : 'text-white/40 bg-white/5'}`}><Star size={18} fill={event.is_highlight ? "currentColor" : "none"} /></button>
                    <button onClick={() => { setEditingItem(event); setEventForm(event); setShowModal(true); }} className="p-2 bg-white/5 text-white/40 hover:text-white rounded-lg"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(event.id)} className="p-2 bg-white/5 text-white/40 hover:text-electric-red rounded-lg"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === "gallery" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold uppercase tracking-wider">Manage Gallery</h2>
              <button onClick={() => { setEditingItem(null); setGalleryForm({ category: "General" }); setShowModal(true); }} className="bg-white text-black px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-electric-red hover:text-white transition-all">
                <Plus size={16} className="inline mr-2" /> Upload Image
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {gallery.map(item => (
                <div key={item.id} className="aspect-square relative group rounded-xl overflow-hidden glass border border-white/10">
                  <img src={item.image_url} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-electric-red/20 text-electric-red rounded-lg hover:bg-electric-red hover:text-white transition-all"><Trash2 size={18} /></button>
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded-md text-[8px] font-bold uppercase text-white/60">{item.category}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === "team" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold uppercase tracking-wider">Manage Team</h2>
              <button onClick={() => { setEditingItem(null); setTeamForm({}); setShowModal(true); }} className="bg-white text-black px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-electric-red hover:text-white transition-all">
                <Plus size={16} className="inline mr-2" /> Add Member
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map(member => (
                <div key={member.id} className="glass p-6 rounded-2xl border border-white/10 group relative">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={member.image_url || "/logo1.svg"} className="w-16 h-16 rounded-full object-cover bg-black border border-white/10" alt="" />
                    <div>
                      <h3 className="font-bold uppercase">{member.name}</h3>
                      <p className="text-electric-red text-[10px] font-black uppercase tracking-widest">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-white/40 text-xs italic mb-4 line-clamp-2">{member.bio}</p>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingItem(member); setTeamForm(member); setShowModal(true); }} className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white group-hover:bg-electric-red transition-all rounded-lg text-[10px] font-black uppercase">Edit Profile</button>
                    <button onClick={() => handleDelete(member.id)} className="px-3 bg-white/5 hover:bg-electric-red/10 text-white/40 hover:text-electric-red rounded-lg transition-all"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold uppercase tracking-wider">Manage Services</h2>
              <button onClick={() => { setEditingItem(null); setServiceForm({}); setShowModal(true); }} className="bg-white text-black px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-electric-red hover:text-white transition-all">
                <Plus size={16} className="inline mr-2" /> Add Service
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(service => (
                <div key={service.id} className="glass p-6 rounded-2xl border border-white/10 group relative">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={service.icon_url || "/icons/instagram.png"} className="w-12 h-12 rounded-full object-contain bg-black border border-white/10" alt="" />
                    <h3 className="font-bold uppercase">{service.title}</h3>
                  </div>
                  <p className="text-white/40 text-xs mb-4 line-clamp-3">{service.description}</p>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingItem(service); setServiceForm(service); setShowModal(true); }} className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[10px] font-black uppercase transition-all">Edit Service</button>
                    <button onClick={() => handleDelete(service.id)} className="px-3 bg-white/5 hover:bg-electric-red/10 text-white/40 hover:text-electric-red rounded-lg transition-all"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-12">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold uppercase tracking-wider">Global Site Settings</h2>
              <button onClick={handleSubmit} className="bg-electric-red text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-electric-red/20 hover:scale-105 transition-all">
                Save Changes
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-electric-red border-b border-white/5 pb-2">Hero Section</h3>
                <div className="space-y-4">
                  <div><label className="text-[10px] uppercase font-black text-white/30 ml-1">Hero Headline</label><input value={settingsForm.hero_headline || ""} onChange={e => setSettingsForm({...settingsForm, hero_headline: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:border-electric-red" /></div>
                  <div><label className="text-[10px] uppercase font-black text-white/30 ml-1">Hero Sub-headline</label><textarea rows={3} value={settingsForm.hero_subheadline || ""} onChange={e => setSettingsForm({...settingsForm, hero_subheadline: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:border-electric-red" /></div>
                </div>

                <h3 className="text-xs font-black uppercase tracking-widest text-electric-red border-b border-white/5 pb-2 pt-4">Global Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div><label className="text-[10px] uppercase font-black text-white/30 ml-1">Events Organized</label><input value={settingsForm.stats_events || ""} onChange={e => setSettingsForm({...settingsForm, stats_events: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:border-electric-red" /></div>
                   <div><label className="text-[10px] uppercase font-black text-white/30 ml-1">Happy Visitors</label><input value={settingsForm.stats_visitors || ""} onChange={e => setSettingsForm({...settingsForm, stats_visitors: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:border-electric-red" /></div>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-electric-red border-b border-white/5 pb-2">About Section</h3>
                <div className="space-y-4">
                  <div><label className="text-[10px] uppercase font-black text-white/30 ml-1">About Headline</label><input value={settingsForm.about_headline || ""} onChange={e => setSettingsForm({...settingsForm, about_headline: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:border-electric-red" /></div>
                  <div><label className="text-[10px] uppercase font-black text-white/30 ml-1">About Description</label><textarea rows={10} value={settingsForm.about_description || ""} onChange={e => setSettingsForm({...settingsForm, about_description: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:border-electric-red" /></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Unified Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-4xl glass p-8 rounded-[32px] border border-white/10 shadow-3xl overflow-y-auto max-h-[90vh]">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">{editingItem ? "Update" : "Create New"} <span className="text-electric-red">{activeTab.slice(0, -1)}</span></h2>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {activeTab === "events" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <ImageUpload value={eventForm.image_url || ""} onChange={url => setEventForm({...eventForm, image_url: url})} />
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-[10px] uppercase font-black text-white/30 ml-1">Status</label><select value={eventForm.status} onChange={e => setEventForm({...eventForm, status: e.target.value as any})} className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:border-electric-red uppercase font-bold text-xs"><option value="published" className="bg-black">Published</option><option value="draft" className="bg-black">Draft</option></select></div>
                        <div><label className="text-[10px] uppercase font-black text-white/30 ml-1">Featured</label><div onClick={() => setEventForm({...eventForm, is_highlight: !eventForm.is_highlight})} className={`w-full p-4 rounded-xl text-center cursor-pointer transition-all uppercase font-bold text-xs border ${eventForm.is_highlight ? 'border-yellow-500 text-yellow-500 bg-yellow-500/5' : 'border-white/5 text-white/30'}`}>{eventForm.is_highlight ? "Highlighted" : "Standard"}</div></div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div><label className="text-[10px] uppercase font-black text-white/30 ml-1">Event Title</label><input required value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:border-electric-red" /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-[10px] uppercase font-black text-white/30 ml-1">Start Date</label><input type="date" required value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:border-electric-red font-sans" /></div>
                        <div><label className="text-[10px] uppercase font-black text-white/30 ml-1">End Date (Optional)</label><input type="date" value={eventForm.end_date || ""} onChange={e => setEventForm({...eventForm, end_date: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:border-electric-red font-sans" /></div>
                      </div>
                      <div><label className="text-[10px] uppercase font-black text-white/30 ml-1">Price (e.g. 500 BDT)</label><input value={eventForm.price || ""} onChange={e => setEventForm({...eventForm, price: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:border-electric-red" /></div>
                      <div><label className="text-[10px] uppercase font-black text-white/30 ml-1">Location</label><input required value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:border-electric-red" /></div>
                      <div><label className="text-[10px] uppercase font-black text-white/30 ml-1">Ticket URL</label><input value={eventForm.tickets_url} onChange={e => setEventForm({...eventForm, tickets_url: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:border-electric-red" placeholder="https://ticketing-site.com/..." /></div>
                      <div><label className="text-[10px] uppercase font-black text-white/30 ml-1">Description</label><textarea rows={3} value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:border-electric-red" /></div>
                    </div>
                  </div>
                )}

                {activeTab === "gallery" && (
                  <div className="space-y-6">
                    <ImageUpload value={galleryForm.image_url || ""} onChange={url => setGalleryForm({...galleryForm, image_url: url})} />
                    <div><label className="text-[10px] uppercase font-black text-white/30 ml-1">Category / Hashtag</label><input required value={galleryForm.category} onChange={e => setGalleryForm({...galleryForm, category: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:border-electric-red" placeholder="e.g. #Concert2026" /></div>
                  </div>
                )}

                 {activeTab === "team" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <ImageUpload value={teamForm.image_url || ""} onChange={url => setTeamForm({...teamForm, image_url: url})} />
                      <div className="space-y-4">
                        <div><label className="text-[10px] uppercase font-black text-white/30 ml-1">Instagram URL</label><input value={teamForm.instagram_url} onChange={e => setTeamForm({...teamForm, instagram_url: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none" /></div>
                        <div><label className="text-[10px] uppercase font-black text-white/30 ml-1">Facebook URL</label><input value={teamForm.fb_url} onChange={e => setTeamForm({...teamForm, fb_url: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none" /></div>
                        <div><label className="text-[10px] uppercase font-black text-white/30 ml-1">LinkedIn URL</label><input value={teamForm.linkedin_url} onChange={e => setTeamForm({...teamForm, linkedin_url: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none" /></div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div><label className="text-[10px] uppercase font-black text-white/30 ml-1">Full Name</label><input required value={teamForm.name} onChange={e => setTeamForm({...teamForm, name: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none" /></div>
                      <div><label className="text-[10px] uppercase font-black text-white/30 ml-1">Role / Title</label><input required value={teamForm.role} onChange={e => setTeamForm({...teamForm, role: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none" /></div>
                      <div><label className="text-[10px] uppercase font-black text-white/30 ml-1">Bio / Background</label><textarea rows={10} value={teamForm.bio} onChange={e => setTeamForm({...teamForm, bio: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none" /></div>
                    </div>
                  </div>
                )}

                {activeTab === "services" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <ImageUpload value={serviceForm.icon_url || ""} onChange={url => setServiceForm({...serviceForm, icon_url: url})} />
                      <p className="text-[10px] text-white/20 uppercase tracking-widest text-center">Upload custom circular PNG icon</p>
                    </div>
                    <div className="space-y-4">
                      <div><label className="text-[10px] uppercase font-black text-white/30 ml-1">Service Title</label><input required value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:border-electric-red" /></div>
                      <div><label className="text-[10px] uppercase font-black text-white/30 ml-1">Description</label><textarea rows={8} value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:border-electric-red" /></div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-4 pt-8 border-t border-white/5">
                  <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 text-white/40 hover:text-white transition-colors uppercase font-black tracking-widest text-xs">Cancel</button>
                  <button type="submit" className="px-12 py-4 bg-electric-red text-white rounded-xl hover:bg-red-600 shadow-xl shadow-electric-red/20 uppercase font-black tracking-widest text-xs">Confirm & Save</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
