import React from 'react';
import { Calendar, X, Play } from 'lucide-react';
import { sounds } from '../engine/soundEngine';

export const DailyChallengeModal = ({ onStartChallenge, onClose }) => {
  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-end sm:items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-5">

        {/* Drag Handle */}
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-400">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-black uppercase tracking-wider">Daily Challenge</span>
          </div>
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Center Content */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl mx-auto shadow-xl shadow-indigo-500/30">
            📅
          </div>
          <h3 className="text-xl font-black text-white">Classroom Warm-Up</h3>
          <p className="text-xs text-indigo-300 font-mono font-bold">{todayStr}</p>
        </div>

        {/* Info Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <p className="text-xs font-bold text-slate-200">Same Questions for the Whole Class Today!</p>
          <ul className="space-y-1.5">
            {[
              '5 adaptive questions, date-seeded (no server)',
              '+300 Bonus XP & Daily Ninja Crest',
              'Ideal for 5-min classroom warm-up or HW'
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                <span className="text-emerald-400 flex-shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Action */}
        <button
          onClick={() => { sounds.playClick(); onStartChallenge(); }}
          className="w-full py-4 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-base shadow-xl shadow-indigo-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5 fill-white" />
          Start Today's Challenge!
        </button>
      </div>
    </div>
  );
};
