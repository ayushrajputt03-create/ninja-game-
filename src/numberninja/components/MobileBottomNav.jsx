import React from 'react';
import '../ninja.css';
import { Map, Play, Calendar, Award, Volume2, VolumeX } from 'lucide-react';
import { sounds } from '../engine/soundEngine';

export const MobileBottomNav = ({ viewState, onGoToMap, onContinueLevel, onOpenDailyChallenge, onOpenCertificate, isMuted, onToggleSound }) => {
  const items = [
    { icon: Map, label: 'Map', action: onGoToMap, isActive: viewState === 'map', color: '#00e5a0' },
    { icon: Calendar, label: 'Daily', action: onOpenDailyChallenge, isActive: false, color: '#6366f1' },
    { icon: null, label: 'Play', action: onContinueLevel, isActive: false, color: '#00e5a0', isCenter: true },
    { icon: Award, label: 'Rank', action: onOpenCertificate, isActive: false, color: '#f59e0b' },
    { icon: isMuted ? VolumeX : Volume2, label: isMuted ? 'Off' : 'Sound', action: onToggleSound, isActive: false, color: isMuted ? '#ef4444' : '#22d3ee' },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden nn-glass nn-safe-bottom"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', paddingTop: 8, paddingBottom: 4, maxWidth: 480, margin: '0 auto' }}>
        {items.map(({ icon: Icon, label, action, isActive, color, isCenter }) => (
          isCenter ? (
            <button
              key={label}
              onClick={() => { sounds.playClick(); action(); }}
              className="active:scale-90 transition-all"
              style={{
                width: 56, height: 56, borderRadius: 20,
                background: `linear-gradient(135deg, ${color}, #00b5d8)`,
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
                boxShadow: `0 4px 20px ${color}50`,
                marginTop: -12,
              }}
            >
              ▶
            </button>
          ) : (
            <button
              key={label}
              onClick={() => { sounds.playClick(); action(); }}
              className="active:scale-90 transition-all"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '6px 12px', borderRadius: 14, background: 'transparent', border: 'none', cursor: 'pointer', opacity: isActive ? 1 : 0.6 }}
            >
              <Icon style={{ width: 22, height: 22, color: isActive ? color : 'var(--text-secondary)' }} />
              <span style={{ fontSize: 10, fontWeight: 800, color: isActive ? color : 'var(--text-muted)', fontFamily: 'var(--font-game)' }}>{label}</span>
              {isActive && <div style={{ width: 4, height: 4, borderRadius: '50%', background: color }} />}
            </button>
          )
        ))}
      </div>
    </div>
  );
};
