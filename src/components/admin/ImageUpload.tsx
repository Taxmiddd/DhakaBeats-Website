"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
}

export default function ImageUpload({ value, onChange, bucket = "dhaka-beats-media" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (error: any) {
      alert("Error uploading image: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden glass border border-white/10 group">
          <img src={value} alt="Upload" className="w-full h-full object-cover" />
          <button
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            aspect-video w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all
            ${isDragging ? "border-electric-red bg-electric-red/5" : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"}
          `}
        >
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={onFileSelect}
            accept="image/*"
          />
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={32} className="text-electric-red animate-spin" />
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-white/40 group-hover:text-white/60">
              <Upload size={32} />
              <p className="text-xs font-bold uppercase tracking-widest text-center">
                Drag & drop or click to upload
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
