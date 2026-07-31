import React, { useRef, useEffect, useState } from 'react';
import {
  generateCertificateCanvas,
  downloadCertificateAsImage,
  downloadCertificateAsPdf
} from '../utils/certificateGenerator';
import { getRankForXpAndWorld } from '../data/ninjaRanks';
import { WORLDS } from '../data/levelsData';
import { Award, Download, FileText, X, User } from 'lucide-react';
import { sounds } from '../engine/soundEngine';

export const CertificateModal = ({ progress, onClose }) => {
  const canvasRef = useRef(null);
  const [nameInput, setNameInput] = useState(progress.playerName || 'Ninja Scholar');
  const [selectedWorldId, setSelectedWorldId] = useState(progress.maxWorldUnlocked || 1);

  const rank = getRankForXpAndWorld(progress.totalXp, progress.maxWorldUnlocked);
  const activeWorld = WORLDS.find(w => w.id === selectedWorldId) || WORLDS[0];

  useEffect(() => {
    if (canvasRef.current) {
      generateCertificateCanvas(canvasRef.current, {
        playerName: nameInput,
        rankTitle: rank.title,
        worldName: `World ${activeWorld.id}: ${activeWorld.name}`,
        xp: progress.totalXp,
        totalMastered: progress.masteredLevels.length
      });
    }
  }, [nameInput, selectedWorldId, progress, rank]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-end sm:items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 my-4">

        {/* Drag Handle */}
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-black text-white">Mastery Certificate</p>
              <p className="text-[10px] text-slate-400 font-mono">Canvas · PNG · PDF</p>
            </div>
          </div>
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
          <div>
            <label className="flex items-center gap-1 text-[10px] font-bold text-slate-400 mb-1.5">
              <User className="w-3 h-3 text-cyan-400" /> Student Name
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              placeholder="Enter full name"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1.5">Select World</label>
            <select
              value={selectedWorldId}
              onChange={e => setSelectedWorldId(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-cyan-400"
            >
              {WORLDS.map(w => (
                <option key={w.id} value={w.id}>W{w.id}: {w.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Canvas Preview */}
        <div className="rounded-2xl overflow-hidden border border-slate-700 bg-black shadow-xl">
          <canvas ref={canvasRef} className="w-full h-auto" />
        </div>

        {/* Download Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              downloadCertificateAsImage(canvasRef.current, `${nameInput.replace(/\s+/g, '_')}_Certificate.png`);
            }}
            className="py-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-100 font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4 text-cyan-400" /> Download PNG
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              downloadCertificateAsPdf(canvasRef.current, `${nameInput.replace(/\s+/g, '_')}_Certificate.pdf`);
            }}
            className="py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
          >
            <FileText className="w-4 h-4" /> Print PDF
          </button>
        </div>
      </div>
    </div>
  );
};
