import React, { useState } from 'react';
import { Palette, Type, Search, FileCode, Check, Copy } from 'lucide-react';

export default function DesignSpecsPanel({ auditData }) {
  const [copiedHex, setCopiedHex] = useState(null);

  if (!auditData) return null;

  const copyToClipboard = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="bg-black border border-zinc-800 p-6 rounded-lg mb-8 space-y-6">
      <h2 className="text-base font-mono font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
        <Palette className="w-5 h-5 text-red-600" /> Design System, SEO & Asset Payload Engine
      </h2>

      {/* Live Website Screenshot Preview */}
      {auditData.screenshotUrl && (
        <div>
          <p className="text-xs text-zinc-400 font-mono mb-2">LIVE WEBSITE PREVIEW SCREENSHOT</p>
          <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 h-56 relative">
            <img
              src={auditData.screenshotUrl}
              alt="Live Website Preview"
              className="w-full h-full object-cover object-top"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>
      )}

      {/* Color Palette & Typography */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        
        {/* Clickable Interactive Color Swatches */}
        <div className="bg-zinc-950 border border-zinc-900 p-4 rounded">
          <p className="text-zinc-500 font-bold mb-3">EXTRACTED COLOR PALETTE (CLICK TO COPY)</p>
          <div className="flex flex-wrap gap-3">
            {auditData.colorPalette?.map((hex, idx) => (
              <button
                key={idx}
                onClick={() => copyToClipboard(hex)}
                className="flex items-center gap-2 bg-black border border-zinc-800 px-3 py-1.5 rounded relative hover:border-zinc-600 transition"
              >
                <span className="w-4 h-4 rounded-full border border-zinc-700" style={{ backgroundColor: hex }}></span>
                <span className="text-white font-bold">{hex}</span>
                {copiedHex === hex ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-zinc-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Font Families */}
        <div className="bg-zinc-950 border border-zinc-900 p-4 rounded">
          <p className="text-zinc-500 font-bold mb-3 flex items-center gap-1.5">
            <Type className="w-4 h-4 text-white" /> TYPOGRAPHY & FONTS
          </p>
          <div className="flex flex-wrap gap-2">
            {auditData.fontFamilies?.map((font, idx) => (
              <span key={idx} className="bg-black border border-zinc-800 text-zinc-300 px-3 py-1 rounded">
                {font}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SEO & Asset Payload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        
        {/* SEO Tags */}
        <div className="bg-zinc-950 border border-zinc-900 p-4 rounded space-y-2">
          <p className="text-zinc-500 font-bold mb-2 flex items-center gap-1.5">
            <Search className="w-4 h-4 text-white" /> SEO & META INSPECTOR
          </p>
          <p className="text-zinc-300"><strong className="text-zinc-500">Title:</strong> {auditData.seo?.title}</p>
          <p className="text-zinc-300"><strong className="text-zinc-500">Meta Desc:</strong> {auditData.seo?.metaDescription}</p>
          <div className="flex gap-4 pt-1">
            <span className={auditData.seo?.hasOgImage ? 'text-emerald-400' : 'text-red-400'}>
              • OG Image: {auditData.seo?.hasOgImage ? 'Present' : 'Missing'}
            </span>
            <span className={auditData.seo?.hasOgTitle ? 'text-emerald-400' : 'text-red-400'}>
              • OG Title: {auditData.seo?.hasOgTitle ? 'Present' : 'Missing'}
            </span>
          </div>
        </div>

        {/* Asset Payload Counts */}
        <div className="bg-zinc-950 border border-zinc-900 p-4 rounded space-y-2">
          <p className="text-zinc-500 font-bold mb-2 flex items-center gap-1.5">
            <FileCode className="w-4 h-4 text-white" /> ASSET PAYLOAD BREAKDOWN
          </p>
          <div className="grid grid-cols-2 gap-2 text-zinc-300">
            <p>JS Scripts: <strong className="text-white">{auditData.assetBreakdown?.scriptCount}</strong></p>
            <p>CSS Stylesheets: <strong className="text-white">{auditData.assetBreakdown?.stylesheetCount}</strong></p>
            <p>Image Tags: <strong className="text-white">{auditData.assetBreakdown?.imageCount}</strong></p>
            <p>HTML Size: <strong className="text-white">{auditData.assetBreakdown?.htmlSizeBytes}</strong></p>
          </div>
        </div>

      </div>
    </div>
  );
}