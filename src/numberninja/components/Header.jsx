import React, { useState } from 'react';
import '../ninja.css';
import { getRankForXpAndWorld } from '../data/ninjaRanks';
import { sounds } from '../engine/soundEngine';
import { Zap, ChevronDown, RotateCcw, Award, Calendar, Volume2, VolumeX, Settings } from 'lucide-react';

export const Header = ({ progress, onResetProgress, onOpenCertificate, onOpenDailyChallenge }) => {
  const [isMuted, setIsMuted] = useState(sounds.isMuted);
  const [showMenu, setShowMenu] = useState(false);

  const rank = getRankForXpAndWorld(progress.totalXp, progress.maxWorldUnlocked);
  const totalMastered = progress.masteredLevels.length;
  const xpPct = Math.min(100, Math.round((progress.totalXp % 1000) / 10));

  const toggleMute = () => {
    const m = sounds.toggleMute();
    setIsMuted(m);
    if (!m) sounds.playClick();
  };

  return (
    <>
      <header
        className="nn-glass fixed top-0 left-0 right-0 z-50 nn-safe-top"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">

          {/* Logo Mark */}
          <div className="relative flex-shrink-0">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl nn-float"
              style={{ background: 'linear-gradient(135deg, #00e5a0, #00b5d8)', boxShadow: '0 4px 20px rgba(0,229,160,0.4)' }}
            >
              🥷
            </div>
          </div>

          {/* XP + Progress */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span
                className="text-xs font-black tracking-wide"
                style={{ fontFamily: 'var(--font-game)', color: 'var(--text-primary)' }}
              >
                {rank.icon} {rank.title}
              </span>
              <div className="flex items-center gap-1">
                <Zap style={{ width: 12, height: 12, color: 'var(--amber)', fill: 'var(--amber)' }} />
                <span
                  className="text-xs font-black"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber)' }}
                >
                  {progress.totalXp.toLocaleString()}
                </span>
              </div>
            </div>
            <div
              className="w-full h-2 rounded-full overflow-hidden relative"
              style={{ background: 'var(--surface3)' }}
            >
              <div
                className="xp-bar-fill h-full rounded-full"
                style={{ width: `${xpPct}%`, transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)' }}
              />
            </div>
            <div className="flex items-center justify-between mt-1">
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {totalMastered}/100 mastered
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Lvl {Math.floor(progress.totalXp / 1000) + 1}
              </span>
            </div>
          </div>

          {/* Settings Button */}
          <button
            onClick={() => { sounds.playClick(); setShowMenu(p => !p); }}
            className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all active:scale-90"
            style={{ background: showMenu ? 'var(--surface3)' : 'var(--surface2)', border: '1px solid var(--border-bright)' }}
          >
            <Settings style={{ width: 16, height: 16, color: showMenu ? 'var(--green)' : 'var(--text-secondary)' }} />
          </button>
        </div>

        {/* Dropdown Menu */}
        {showMenu && (
          <div
            className="nn-scale-in max-w-lg mx-auto px-4 pb-3"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <div className="grid grid-cols-3 gap-2 pt-3">
              {[
                { icon: Volume2, activeIcon: VolumeX, label: isMuted ? 'Unmute' : 'Sound', action: toggleMute, active: !isMuted, color: 'var(--green)' },
                { icon: Calendar, label: 'Daily', action: () => { sounds.playClick(); onOpenDailyChallenge(); setShowMenu(false); }, color: 'var(--indigo)' },
                { icon: Award, label: 'Certificate', action: () => { sounds.playClick(); onOpenCertificate(); setShowMenu(false); }, color: 'var(--amber)' },
              ].map(({ icon: Icon, activeIcon: ActiveIcon, label, action, active, color }) => (
                <button
                  key={label}
                  onClick={action}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all active:scale-95"
                  style={{ background: 'var(--surface2)', border: `1px solid var(--border)` }}
                >
                  <Icon style={{ width: 18, height: 18, color: color || 'var(--text-secondary)' }} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-secondary)', fontFamily: 'var(--font-game)' }}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                if (window.confirm('Reset all 100-level progress? This cannot be undone.')) {
                  onResetProgress(); setShowMenu(false);
                }
              }}
              className="w-full mt-2 py-2.5 rounded-2xl text-xs font-black active:scale-95 transition-all"
              style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', color: 'var(--rose)', fontFamily: 'var(--font-game)' }}
            >
              ↺ Reset All Progress
            </button>
          </div>
        )}
      </header>

      {/* Spacer so content clears the fixed header */}
      <div style={{ height: showMenu ? 168 : 80 }} className="flex-shrink-0 transition-all duration-300" />
    </>
  );
};
