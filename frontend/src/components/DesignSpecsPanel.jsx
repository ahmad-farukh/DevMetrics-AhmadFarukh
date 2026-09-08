import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Palette, Type, Search, FileCode, Check, Copy, Layout, Sparkles, Paintbrush } from 'lucide-react';

export default function DesignSpecsPanel({ auditData: propAuditData }) {
  const reduxAuditData = useSelector((state) => state.monitor.currentAudit);
  const auditData = propAuditData || reduxAuditData;

  const [copiedHex, setCopiedHex] = useState(null);

  if (!auditData) return null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedHex(text);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const frameworks = auditData.stylingFrameworks || [];
  const animations = auditData.animationsDetected || [];
  const gradients = auditData.gradients || [];

  return (
    <div className="bg-black border border-zinc-800 p-6 rounded-lg mb-8 space-y-6 font-mono text-xs">
      <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
        <Palette className="w-5 h-5 text-red-600" /> Design System, SEO & Asset Payload Engine
      </h2>

      {/* Live Website Screenshot Preview (If available) */}
      {auditData.screenshotUrl && (
        <div>
          <p className="text-zinc-400 font-bold mb-2">LIVE WEBSITE PREVIEW SCREENSHOT</p>
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

      {/* Grid 1: Frameworks, Color Palette, Gradients & Animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Styling Frameworks & Libraries */}
        <div className="bg-zinc-950 border border-zinc-900 p-4 rounded space-y-2">
          <p className="text-zinc-500 font-bold flex items-center gap-1.5">
            <Layout className="w-4 h-4 text-white" /> STYLING FRAMEWORKS & LIBRARIES
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {frameworks.length > 0 ? (
              frameworks.map((framework, idx) => (
                <span key={idx} className="bg-zinc-900 text-zinc-200 border border-zinc-800 px-2.5 py-1 rounded font-bold">
                  {framework}
                </span>
              ))
            ) : (
              <span className="text-zinc-600">• Vanilla CSS / Custom Styles</span>
            )}
          </div>
        </div>

        {/* Animations & Motion Libraries */}
        <div className="bg-zinc-950 border border-zinc-900 p-4 rounded space-y-2">
          <p className="text-zinc-500 font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-white" /> ANIMATIONS & MOTION
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {animations.length > 0 ? (
              animations.map((anim, idx) => (
                <span key={idx} className="bg-zinc-900 text-red-500 border border-zinc-800 px-2.5 py-1 rounded font-bold">
                  {anim}
                </span>
              ))
            ) : (
              <span className="text-zinc-600">• Standard CSS Keyframes</span>
            )}
          </div>
        </div>

        {/* Color Swatches */}
        <div className="bg-zinc-950 border border-zinc-900 p-4 rounded space-y-2">
          <p className="text-zinc-500 font-bold">EXTRACTED COLOR PALETTE (CLICK TO COPY)</p>
          <div className="flex flex-wrap gap-2 pt-1">
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

        {/* Fonts & Typography */}
        <div className="bg-zinc-950 border border-zinc-900 p-4 rounded space-y-2">
          <p className="text-zinc-500 font-bold flex items-center gap-1.5">
            <Type className="w-4 h-4 text-white" /> TYPOGRAPHY & FONTS
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {auditData.fontFamilies?.map((font, idx) => (
              <span key={idx} className="bg-black border border-zinc-800 text-zinc-300 px-3 py-1.5 rounded">
                {font}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Gradients Section (If detected) */}
      {gradients.length > 0 && (
        <div className="bg-zinc-950 border border-zinc-900 p-4 rounded space-y-2">
          <p className="text-zinc-500 font-bold flex items-center gap-1.5">
            <Paintbrush className="w-4 h-4 text-white" /> DETECTED GRADIENTS
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
            {gradients.map((grad, idx) => (
              <div key={idx} className="bg-black border border-zinc-800 p-2 rounded space-y-2">
                <div className="h-8 rounded w-full border border-zinc-800" style={{ background: grad }} />
                <p className="text-[10px] text-zinc-400 truncate">{grad}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid 2: SEO & Asset Payload Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SEO Tags */}
        <div className="bg-zinc-950 border border-zinc-900 p-4 rounded space-y-2">
          <p className="text-zinc-500 font-bold mb-2 flex items-center gap-1.5">
            <Search className="w-4 h-4 text-white" /> SEO & META INSPECTOR
          </p>
          <p className="text-zinc-300"><strong className="text-zinc-500">Title:</strong> {auditData.seo?.title || 'N/A'}</p>
          <p className="text-zinc-300"><strong className="text-zinc-500">Meta Desc:</strong> {auditData.seo?.metaDescription || 'N/A'}</p>
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
            <p>JS Scripts: <strong className="text-white">{auditData.assetBreakdown?.scriptCount ?? 0}</strong></p>
            <p>CSS Stylesheets: <strong className="text-white">{auditData.assetBreakdown?.stylesheetCount ?? 0}</strong></p>
            <p>Image Tags: <strong className="text-white">{auditData.assetBreakdown?.imageCount ?? 0}</strong></p>
            <p>HTML Size: <strong className="text-white">{auditData.assetBreakdown?.htmlSizeBytes ?? '0 B'}</strong></p>
          </div>
        </div>

      </div>
    </div>
  );
}