import React, { useState } from 'react';
import '../ninja.css';
import { WORLDS, LEVELS } from '../data/levelsData';
import { sounds } from '../engine/soundEngine';
import { Lock, CheckCircle, Swords, ChevronRight, Play, Trophy } from 'lucide-react';

const WORLD_ICONS = ['➕', '✖️', '➗', '🍕', '🍰', '🔢', '🏷️', '📐', '🧩', '🥷'];
const WORLD_COLORS = [
  '#00e5a0', // W1 green
  '#3b82f6', // W2 blue
  '#8b5cf6', // W3 purple
  '#06b6d4', // W4 teal
  '#ec4899', // W5 pink
  '#6366f1', // W6 indigo
  '#f97316', // W7 orange
  '#22c55e', // W8 green2
  '#ef4444', // W9 red
  '#f59e0b', // W10 gold
];

export const WorldMap = ({ progress, onSelectLevel, onOpenCertificate }) => {
  const [expandedWorld, setExpandedWorld] = useState(progress.maxWorldUnlocked || 1);

  const maxUnlockedId = Math.max(...progress.unlockedLevels, 1);

  const isWorldUnlocked = (worldId) => {
    if (worldId === 1) return true;
    return progress.unlockedLevels.includes((worldId - 1) * 10 + 1);
  };

  const getWorldProgress = (worldId) => {
    const ids = Array.from({ length: 10 }, (_, i) => (worldId - 1) * 10 + i + 1);
    const mastered = ids.filter(id => progress.masteredLevels.includes(id)).length;
    return { mastered, total: 10, pct: mastered * 10 };
  };

  return (
    <div className="max-w-lg mx-auto px-4 pb-32">

      {/* Hero Quick-Play Banner */}
      <div className="relative mb-6 rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #051b11 0%, #0a3322 60%, #052217 100%)', border: '1px solid rgba(0,229,160,0.15)' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,160,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="relative p-5">
          <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--green)', letterSpacing: '0.15em', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
            Continue Your Journey
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-game)', lineHeight: 1.15, margin: '6px 0 4px' }}>
            Level {maxUnlockedId}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-game)', fontWeight: 700, marginBottom: 16 }}>
            {LEVELS.find(l => l.id === maxUnlockedId)?.title.replace(`Level ${maxUnlockedId}: `, '') || ''}
          </p>

          <button
            onClick={() => {
              sounds.playClick();
              const lvl = LEVELS.find(l => l.id === maxUnlockedId) || LEVELS[0];
              onSelectLevel(lvl);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm active:scale-95 transition-all"
            style={{ background: 'var(--green)', color: '#030a06', boxShadow: '0 4px 20px rgba(0,229,160,0.4)', fontFamily: 'var(--font-game)' }}
          >
            <Play style={{ width: 16, height: 16, fill: '#030a06' }} />
            Play Now!
          </button>
        </div>

        {/* Overall Progress */}
        <div style={{ borderTop: '1px solid rgba(0,229,160,0.1)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
            TOTAL MASTERY
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, marginLeft: 12 }}>
            <div style={{ flex: 1, height: 4, background: 'var(--surface3)', borderRadius: 99, overflow: 'hidden' }}>
              <div className="xp-bar-fill" style={{ height: '100%', width: `${progress.masteredLevels.length}%`, borderRadius: 99 }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--green)', fontFamily: 'var(--font-mono)', minWidth: 50, textAlign: 'right' }}>
              {progress.masteredLevels.length}/100
            </span>
          </div>
        </div>
      </div>

      {/* World List — Accordion Style */}
      <div className="space-y-3">
        {WORLDS.map((world) => {
          const unlocked = isWorldUnlocked(world.id);
          const wp = getWorldProgress(world.id);
          const isOpen = expandedWorld === world.id;
          const worldLevels = LEVELS.filter(l => l.worldId === world.id);
          const color = WORLD_COLORS[world.id - 1];

          return (
            <div
              key={world.id}
              className="rounded-3xl overflow-hidden"
              style={{
                border: isOpen ? `1px solid ${color}30` : '1px solid var(--border)',
                background: 'var(--surface)',
                transition: 'border-color 0.2s',
              }}
            >
              {/* World Header Row */}
              <button
                disabled={!unlocked}
                onClick={() => {
                  sounds.playClick();
                  setExpandedWorld(isOpen ? null : world.id);
                }}
                className="w-full flex items-center gap-3 p-4 text-left active:opacity-80 transition-opacity"
                style={{ opacity: unlocked ? 1 : 0.45 }}
              >
                {/* Icon circle */}
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
                  style={{
                    background: unlocked ? `${color}18` : 'var(--surface3)',
                    border: `2px solid ${unlocked ? color + '40' : 'transparent'}`,
                  }}
                >
                  {unlocked ? world.icon : <Lock style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />}
                </div>

                {/* World Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span style={{ fontSize: 10, fontWeight: 800, color: unlocked ? color : 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      World {world.id}
                    </span>
                    {wp.mastered === 10 && (
                      <span style={{ fontSize: 9, fontWeight: 800, color: '#030a06', background: color, borderRadius: 6, padding: '1px 5px', fontFamily: 'var(--font-mono)' }}>
                        DONE
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 900, color: unlocked ? 'var(--text-primary)' : 'var(--text-muted)', fontFamily: 'var(--font-game)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {world.name}
                  </p>

                  {/* Segmented Progress */}
                  {unlocked && (
                    <div className="flex gap-0.5 mt-1.5">
                      {Array.from({ length: 10 }).map((_, i) => {
                        const lvlId = (world.id - 1) * 10 + i + 1;
                        const mastered = progress.masteredLevels.includes(lvlId);
                        const isBoss = i === 9;
                        return (
                          <div
                            key={i}
                            style={{
                              flex: isBoss ? 1.5 : 1,
                              height: 4,
                              borderRadius: 99,
                              background: mastered ? color : 'var(--surface3)',
                              transition: 'background 0.3s',
                            }}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Chevron */}
                <ChevronRight
                  style={{
                    width: 18, height: 18,
                    color: unlocked ? 'var(--text-muted)' : 'var(--surface3)',
                    transform: isOpen ? 'rotate(90deg)' : 'rotate(0)',
                    transition: 'transform 0.2s',
                    flexShrink: 0,
                  }}
                />
              </button>

              {/* Level Grid — shown when expanded */}
              {isOpen && unlocked && (
                <div
                  className="nn-fade-up"
                  style={{ borderTop: `1px solid ${color}20`, padding: '16px 14px', background: '#0a0c12' }}
                >
                  {/* Duolingo-style path */}
                  <div className="flex flex-col items-center gap-0">
                    {worldLevels.map((lvl, i) => {
                      const isUnlocked = progress.unlockedLevels.includes(lvl.id);
                      const isMastered = progress.masteredLevels.includes(lvl.id);
                      const score = progress.levelScores[lvl.id] || { stars: 0 };
                      const isActive = lvl.id === maxUnlockedId && !isMastered;
                      const isLeft = i % 2 === 0;

                      return (
                        <div key={lvl.id} className="w-full flex flex-col items-center">
                          {/* Row with level node offset left/right */}
                          <div
                            className="flex w-full items-center"
                            style={{ justifyContent: isLeft ? 'flex-start' : 'flex-end', paddingLeft: isLeft ? 24 : 0, paddingRight: isLeft ? 0 : 24 }}
                          >
                            <button
                              disabled={!isUnlocked}
                              onClick={() => { sounds.playClick(); onSelectLevel(lvl); }}
                              className={`relative flex items-center gap-2.5 active:scale-95 transition-all ${isActive ? 'level-node-active' : ''} ${lvl.isBoss && isUnlocked ? 'boss-level-card' : ''}`}
                              style={{
                                background: isMastered ? color : isUnlocked ? 'var(--surface2)' : 'var(--surface3)',
                                border: `2px solid ${isMastered ? color : isUnlocked ? `${color}50` : 'transparent'}`,
                                borderRadius: lvl.isBoss ? 20 : 16,
                                padding: lvl.isBoss ? '10px 16px' : '8px 14px',
                                opacity: isUnlocked ? 1 : 0.4,
                                minWidth: lvl.isBoss ? 180 : 148,
                                boxShadow: isMastered ? `0 4px 20px ${color}30` : 'none',
                              }}
                            >
                              {/* Level number circle */}
                              <div
                                style={{
                                  width: lvl.isBoss ? 36 : 30,
                                  height: lvl.isBoss ? 36 : 30,
                                  borderRadius: lvl.isBoss ? 12 : 10,
                                  background: isMastered ? 'rgba(0,0,0,0.25)' : isUnlocked ? `${color}20` : 'var(--surface)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  flexShrink: 0,
                                }}
                              >
                                {!isUnlocked ? (
                                  <Lock style={{ width: 12, height: 12, color: 'var(--text-muted)' }} />
                                ) : isMastered ? (
                                  <CheckCircle style={{ width: lvl.isBoss ? 18 : 15, height: lvl.isBoss ? 18 : 15, color: '#030a06' }} />
                                ) : lvl.isBoss ? (
                                  <Swords style={{ width: 16, height: 16, color: 'var(--rose)' }} />
                                ) : (
                                  <span style={{ fontSize: 11, fontWeight: 800, color: color, fontFamily: 'var(--font-mono)' }}>
                                    {lvl.id}
                                  </span>
                                )}
                              </div>

                              {/* Label */}
                              <div>
                                {lvl.isBoss && (
                                  <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--rose)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                                    ⚔️ Boss Battle
                                  </p>
                                )}
                                <p style={{
                                  fontSize: lvl.isBoss ? 13 : 12,
                                  fontWeight: 900,
                                  color: isMastered ? '#030a06' : 'var(--text-primary)',
                                  fontFamily: 'var(--font-game)',
                                  margin: 0,
                                  maxWidth: 110,
                                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}>
                                  {lvl.title.replace(`Level ${lvl.id}: `, '').replace('World ' + lvl.worldId + ' Boss Battle! 🏆', 'Boss!').replace("FINAL BOSS: GRANDMASTER NINJA 🥷", "Final Boss")}
                                </p>
                                {/* Stars */}
                                {isMastered && (
                                  <div className="flex gap-0.5 mt-0.5">
                                    {[1,2,3].map(s => (
                                      <svg key={s} width="9" height="9" viewBox="0 0 12 12" fill={s <= score.stars ? '#030a06' : 'rgba(0,0,0,0.25)'}>
                                        <polygon points="6,1 7.5,4.5 11,4.8 8.5,7 9.2,10.5 6,8.5 2.8,10.5 3.5,7 1,4.8 4.5,4.5" />
                                      </svg>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </button>
                          </div>

                          {/* Connector line between levels */}
                          {i < worldLevels.length - 1 && (
                            <div style={{ display: 'flex', width: '100%', justifyContent: isLeft ? 'flex-start' : 'flex-end', paddingLeft: isLeft ? 48 : 0, paddingRight: isLeft ? 0 : 48 }}>
                              <div
                                className={`level-path-line ${isMastered ? 'completed' : ''}`}
                                style={{ height: 24 }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* World complete CTA */}
                  {wp.mastered === 10 && (
                    <button
                      onClick={() => { sounds.playClick(); onOpenCertificate(); }}
                      className="w-full mt-4 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                      style={{ background: `${color}20`, border: `1px solid ${color}50`, color: color, fontFamily: 'var(--font-game)' }}
                    >
                      <Trophy style={{ width: 16, height: 16 }} />
                      Claim World {world.id} Certificate!
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
