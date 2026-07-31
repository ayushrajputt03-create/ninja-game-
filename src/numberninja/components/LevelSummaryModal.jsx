import React, { useEffect } from 'react';
import '../ninja.css';
import { sounds } from '../engine/soundEngine';

const WORLD_COLORS = ['#00e5a0','#3b82f6','#8b5cf6','#06b6d4','#ec4899','#6366f1','#f97316','#22c55e','#ef4444','#f59e0b'];

export const LevelSummaryModal = ({ summary, onRetryLevel, onNextLevel, onBackToMap }) => {
  const { level, accuracyPct, isMastered, maxCombo, weakTopicsRecorded } = summary;
  const color = WORLD_COLORS[(level.worldId || 1) - 1];
  const stars = accuracyPct >= 95 ? 3 : accuracyPct >= 85 ? 2 : accuracyPct >= 80 ? 1 : 0;
  const xpEarned = isMastered ? level.xpReward + maxCombo * 10 : 25;

  useEffect(() => { if (isMastered) sounds.playVictory(); }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 16 }}>
      <div
        className="nn-bottom-sheet w-full"
        style={{
          maxWidth: 480,
          background: 'var(--surface)',
          border: `1px solid ${color}25`,
          borderRadius: 28,
          padding: '20px',
          boxShadow: `0 -20px 60px rgba(0,0,0,0.6), 0 0 60px ${color}15`,
        }}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 99, background: 'var(--surface3)', margin: '0 auto 20px' }} />

        {/* Result Emoji + Title */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 12 }}>
            {isMastered ? (level.isBoss ? '🏆' : '🏅') : '😤'}
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-game)', margin: '0 0 4px' }}>
            {isMastered ? (level.isBoss ? 'BOSS DEFEATED!' : 'MASTERED!') : 'KEEP GOING!'}
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', margin: 0 }}>
            Need {level.masteryThreshold}% to pass · You scored {accuracyPct}%
          </p>
        </div>

        {/* Stars Row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
          {[1, 2, 3].map(s => (
            <svg key={s} width={s <= stars ? 44 : 36} height={s <= stars ? 44 : 36} viewBox="0 0 24 24" style={{ transition: 'all 0.3s', filter: s <= stars ? `drop-shadow(0 0 8px ${color}80)` : 'none' }}>
              <polygon
                points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                fill={s <= stars ? color : 'var(--surface3)'}
                stroke={s <= stars ? color : 'transparent'}
              />
            </svg>
          ))}
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
          {[
            { label: 'Accuracy', value: `${accuracyPct}%`, valueColor: accuracyPct >= level.masteryThreshold ? color : 'var(--rose)' },
            { label: 'Max Streak', value: `×${maxCombo}`, valueColor: 'var(--amber)' },
            { label: 'XP Earned', value: `+${xpEarned}`, valueColor: 'var(--cyan)' },
          ].map(({ label, value, valueColor }) => (
            <div key={label} style={{ padding: '12px 10px', borderRadius: 18, background: 'var(--surface2)', border: '1px solid var(--border)', textAlign: 'center' }}>
              <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>{label}</p>
              <p style={{ fontSize: 22, fontWeight: 900, color: valueColor, fontFamily: 'var(--font-mono)', margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Weak topics */}
        {weakTopicsRecorded?.length > 0 && (
          <div style={{ padding: '12px 14px', borderRadius: 18, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', marginBottom: 14, display: 'flex', gap: 10 }}>
            <span style={{ fontSize: 16 }}>📌</span>
            <div>
              <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--amber)', fontFamily: 'var(--font-game)', margin: '0 0 2px' }}>Spaced Repetition Active</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-game)', margin: 0 }}>
                <span style={{ color: 'var(--amber)', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>{weakTopicsRecorded.join(', ')}</span> flagged — will reappear in next levels.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {isMastered ? (
            <button
              onClick={() => { sounds.playClick(); onNextLevel(); }}
              className="w-full active:scale-95 transition-all"
              style={{ padding: 16, borderRadius: 22, background: `linear-gradient(135deg, ${color}, ${color}cc)`, color: '#030a06', fontWeight: 900, fontSize: 16, fontFamily: 'var(--font-game)', border: 'none', cursor: 'pointer', boxShadow: `0 4px 24px ${color}40` }}
            >
              Next Level →
            </button>
          ) : (
            <button
              onClick={() => { sounds.playClick(); onRetryLevel(); }}
              className="w-full active:scale-95 transition-all"
              style={{ padding: 16, borderRadius: 22, background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: '#030a06', fontWeight: 900, fontSize: 16, fontFamily: 'var(--font-game)', border: 'none', cursor: 'pointer', boxShadow: '0 4px 24px rgba(245,158,11,0.35)' }}
            >
              ↺ Retry — Fresh Questions
            </button>
          )}
          <button
            onClick={() => { sounds.playClick(); onBackToMap(); }}
            className="w-full active:scale-95 transition-all"
            style={{ padding: 14, borderRadius: 22, background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontWeight: 800, fontSize: 14, fontFamily: 'var(--font-game)', cursor: 'pointer' }}
          >
            Back to World Map
          </button>
        </div>
      </div>
    </div>
  );
};
