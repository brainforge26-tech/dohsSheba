'use client';

import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Loader2, X, Link as LinkIcon } from 'lucide-react';
import { uploadSingleImageApi } from '@/lib/api-client';
import { useToast } from '@/components/ui/Toast';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  aspectRatio?: 'video' | 'square' | 'banner' | 'auto';
  className?: string;
}

export function ImageUploader({
  value,
  onChange,
  label = 'Upload Image File',
  placeholder = 'Click or drag & drop an image file here to upload',
  aspectRatio = 'auto',
  className = '',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { error: toastError, success: toastSuccess } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processUpload(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processUpload(file);
  };

  const processUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toastError('Invalid File', 'Please select a valid image file (PNG, JPG, WEBP, GIF).');
      return;
    }

    try {
      setUploading(true);
      const url = await uploadSingleImageApi(file);
      onChange(url);
      toastSuccess('Image Uploaded', 'Image file uploaded successfully.');
    } catch (err: any) {
      toastError('Upload Failed', err?.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-xs font-bold text-slate-300 mb-1">{label}</label>}

      {value ? (
        /* Image Preview Box */
        <div className="relative rounded-2xl border border-white/10 bg-slate-950 overflow-hidden group">
          <div
            className={`w-full ${
              aspectRatio === 'video'
                ? 'aspect-video'
                : aspectRatio === 'square'
                ? 'aspect-square'
                : aspectRatio === 'banner'
                ? 'h-36'
                : 'h-40'
            } relative flex items-center justify-center bg-slate-900`}
          >
            <img src={value} alt="Uploaded Preview" className="w-full h-full object-cover" />

            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer"
              >
                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>{uploading ? 'Uploading...' : 'Change File'}</span>
              </button>

              <button
                type="button"
                onClick={() => onChange('')}
                className="p-2 rounded-xl bg-rose-500/80 hover:bg-rose-500 text-white font-bold transition-all cursor-pointer"
                title="Remove Image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Upload Area */
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="relative border-2 border-dashed border-white/15 hover:border-emerald-500/50 rounded-2xl p-5 bg-slate-950/60 hover:bg-slate-900/80 transition-all cursor-pointer text-center space-y-2 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
          </div>

          <div className="space-y-0.5">
            <p className="text-xs font-bold text-slate-200">
              {uploading ? 'Uploading image to server...' : placeholder}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">Click to select or drag &amp; drop file (PNG, JPG, WEBP)</p>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Optional URL Toggle */}
      <div className="flex items-center justify-between text-[11px] pt-0.5">
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Hide URL Field' : 'Or paste Image URL directly'}</span>
        </button>
      </div>

      {showUrlInput && (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://images.unsplash.com/..."
          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs font-medium text-white focus:outline-none focus:border-emerald-500"
        />
      )}
    </div>
  );
}
