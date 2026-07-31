import React from 'react';
import '../ninja.css';
import { sounds } from '../engine/soundEngine';

export const ExplanationModal = ({ question, selected, onContinue }) => {
  const exp = question.explanation;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 16 }}>
      <div
        className="nn-bottom-sheet w-full"
        style={{
          maxWidth: 480,
          background: 'var(--surface)',
          border: '1px solid rgba(244,63,94,0.2)',
          borderRadius: '28px 28px 28px 28px',
          padding: '20px',
          boxShadow: '0 -20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 99, background: 'var(--surface3)', margin: '0 auto 16px' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 42, height: 42, borderRadius: 16, background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
            💡
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--rose)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>Oops! Wrong Answer</p>
            <p style={{ fontSize: 15, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-game)', margin: '2px 0 0' }}>{exp?.title}</p>
          </div>
        </div>

        {/* Answer Comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <div style={{ padding: '12px 14px', borderRadius: 18, background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)' }}>
            <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>Your answer</p>
            <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--rose)', fontFamily: 'var(--font-mono)', margin: 0, wordBreak: 'break-all' }}>
              {selected === '__TIMEOUT__' ? '⏱ Time up!' : selected}
            </p>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: 18, background: 'rgba(0,229,160,0.08)', border: '1px solid rgba(0,229,160,0.2)' }}>
            <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>Correct</p>
            <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--green)', fontFamily: 'var(--font-mono)', margin: 0, wordBreak: 'break-all' }}>{question.correctAnswer}</p>
          </div>
        </div>

        {/* Concept Box */}
        <div style={{ padding: '14px', borderRadius: 18, background: 'var(--surface2)', border: '1px solid var(--border)', marginBottom: 14 }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--amber)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>🥷 Ninja Tip</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-game)', lineHeight: 1.55, margin: '0 0 8px' }}>{exp?.tip}</p>
          {exp?.example && (
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--font-mono)', borderTop: '1px solid var(--border)', paddingTop: 8, margin: 0 }}>
              {exp.example}
            </p>
          )}
        </div>

        {/* Continue */}
        <button
          onClick={() => { sounds.playClick(); onContinue(); }}
          className="w-full active:scale-95 transition-all"
          style={{
            padding: '16px',
            borderRadius: 22,
            background: 'linear-gradient(135deg, #00e5a0, #00b5d8)',
            color: '#030a06',
            fontWeight: 900,
            fontSize: 15,
            fontFamily: 'var(--font-game)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,229,160,0.35)',
          }}
        >
          Got it! Continue →
        </button>
      </div>
    </div>
  );
};
