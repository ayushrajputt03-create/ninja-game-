import React, { useState, useEffect, useRef } from 'react';
import '../ninja.css';
import { generateQuestion } from '../engine/questionGenerator';
import { AdaptiveEngine } from '../engine/adaptiveEngine';
import { sounds } from '../engine/soundEngine';
import { ExplanationModal } from './ExplanationModal';
import { ArrowLeft, Swords } from 'lucide-react';

const WORLD_COLORS = [
  '#00e5a0','#3b82f6','#8b5cf6','#06b6d4','#ec4899',
  '#6366f1','#f97316','#22c55e','#ef4444','#f59e0b',
];

export const GameplayScreen = ({ level, weakTopics, onFinishLevel, onBackToMap }) => {
  const color = WORLD_COLORS[(level.worldId || 1) - 1];
  const [adaptiveEngine] = useState(() => new AdaptiveEngine(level.difficultyTier));
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answersLog, setAnswersLog] = useState([]);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(level.timeLimitPerQuestion);
  const [explanationData, setExplanationData] = useState(null);
  const timerRef = useRef(null);
  const startRef = useRef(Date.now());

  useEffect(() => {
    adaptiveEngine.resetSession(level.difficultyTier);
    setQuestions(Array.from({ length: level.questionCount }, () =>
      generateQuestion(level, adaptiveEngine.getCurrentTier(), weakTopics)
    ));
    if (level.isBoss) sounds.playBossSiren();
  }, [level]);

  useEffect(() => {
    if (explanationData || currentIdx >= questions.length || questions.length === 0) return;
    setTimeLeft(level.timeLimitPerQuestion);
    setSelected(null);
    setRevealed(false);
    startRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) { clearInterval(timerRef.current); handleSubmit('__TIMEOUT__', true); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentIdx, questions.length, explanationData]);

  const handleSubmit = (option, isTimeout = false) => {
    clearInterval(timerRef.current);
    const q = questions[currentIdx];
    const time = Math.round((Date.now() - startRef.current) / 1000);
    const isCorrect = !isTimeout && option === q.correctAnswer;

    setSelected(option);
    setRevealed(true);
    adaptiveEngine.recordAnswer(isCorrect, time, q.topic);

    if (isCorrect) {
      sounds.playCorrect();
      const nc = combo + 1;
      setCombo(nc);
      if (nc > maxCombo) setMaxCombo(nc);
    } else {
      sounds.playWrong();
      setCombo(0);
    }

    const log = [...answersLog, { question: q, selected: option, isCorrect, timeSpent: time }];
    setAnswersLog(log);

    setTimeout(() => {
      if (!isCorrect) {
        setExplanationData({ question: q, selected: option, onContinue: () => { setExplanationData(null); advance(log); } });
      } else {
        advance(log);
      }
    }, 700);
  };

  const advance = (log) => {
    if (currentIdx + 1 < questions.length) {
      const nq = generateQuestion(level, adaptiveEngine.getCurrentTier(), weakTopics);
      setQuestions(prev => { const n = [...prev]; n[currentIdx + 1] = nq; return n; });
      setCurrentIdx(p => p + 1);
    } else {
      const correct = log.filter(l => l.isCorrect).length;
      const pct = Math.round((correct / log.length) * 100);
      onFinishLevel({ level, log, accuracyPct: pct, isMastered: pct >= level.masteryThreshold, maxCombo, weakTopicsRecorded: adaptiveEngine.getWeakTopics() });
    }
  };

  if (questions.length === 0) return (
    <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(0,229,160,0.2)', borderTopColor: '#00e5a0', animation: 'spin-slow 0.8s linear infinite' }} />
    </div>
  );

  const q = questions[currentIdx];
  const timerPct = (timeLeft / level.timeLimitPerQuestion) * 100;
  const timerColor = timeLeft <= 5 ? '#ef4444' : timeLeft <= 10 ? '#f59e0b' : color;
  const R = 28;
  const C = 2 * Math.PI * R;

  const getOptionClass = (opt) => {
    if (!revealed) return 'answer-option';
    if (opt === q.correctAnswer) return 'answer-option correct';
    if (opt === selected && opt !== q.correctAnswer) return 'answer-option wrong';
    return 'answer-option dimmed';
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-4">

      {/* ── Top Bar ── */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => { if (window.confirm('Exit level?')) onBackToMap(); }}
          className="w-9 h-9 rounded-2xl flex items-center justify-center active:scale-90 transition-all"
          style={{ background: 'var(--surface2)', border: '1px solid var(--border-bright)' }}
        >
          <ArrowLeft style={{ width: 16, height: 16, color: 'var(--text-secondary)' }} />
        </button>

        {/* Progress Track */}
        <div className="flex items-center gap-1.5 flex-1">
          {questions.map((_, i) => {
            const log = answersLog[i];
            const isActive = i === currentIdx;
            return (
              <div key={i} style={{
                flex: isActive ? 1.8 : 1,
                height: 6,
                borderRadius: 99,
                background: isActive ? color : log ? (log.isCorrect ? color : '#ef4444') : 'var(--surface3)',
                transition: 'all 0.3s',
                opacity: isActive ? 1 : log ? 0.9 : 0.4,
              }} />
            );
          })}
        </div>

        {/* Combo Badge */}
        {combo >= 2 && (
          <div
            className="flex items-center gap-1 px-3 py-1 rounded-full streak-pop"
            style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)' }}
          >
            <span className="streak-flame" style={{ fontSize: 14 }}>🔥</span>
            <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--amber)', fontFamily: 'var(--font-mono)' }}>×{combo}</span>
          </div>
        )}
        {level.isBoss && (
          <div
            className="flex items-center gap-1 px-3 py-1 rounded-full"
            style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)' }}
          >
            <Swords style={{ width: 12, height: 12, color: 'var(--rose)' }} />
            <span style={{ fontSize: 10, fontWeight: 900, color: 'var(--rose)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Boss</span>
          </div>
        )}
      </div>

      {/* ── Question Card ── */}
      <div
        className="nn-fade-up relative overflow-hidden"
        style={{
          background: 'var(--surface)',
          border: `1px solid ${color}20`,
          borderRadius: 28,
          padding: '20px 20px 20px',
          marginBottom: 16,
          boxShadow: `0 0 40px ${color}08`,
        }}
      >
        {/* Subtle top accent line */}
        <div style={{ position: 'absolute', top: 0, left: 20, right: 20, height: 2, background: `linear-gradient(90deg, transparent, ${color}, transparent)`, borderRadius: '0 0 4px 4px' }} />

        {/* Timer + Q number row */}
        <div className="flex items-center justify-between mb-4">
          <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Q{currentIdx + 1} <span style={{ color: 'var(--surface3)', margin: '0 4px' }}>—</span> {answersLog.filter(l => l.isCorrect).length}/{answersLog.length} correct
          </span>

          {/* Circular Timer */}
          <div className="relative" style={{ width: 52, height: 52 }}>
            <svg width="52" height="52" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="32" cy="32" r={R} fill="none" stroke="var(--surface3)" strokeWidth="5" />
              <circle
                cx="32" cy="32" r={R}
                fill="none"
                stroke={timerColor}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - timerPct / 100)}
                className="timer-ring"
                style={{ filter: `drop-shadow(0 0 4px ${timerColor}60)` }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span
                style={{ fontSize: 15, fontWeight: 800, color: timerColor, fontFamily: 'var(--font-mono)' }}
                className={timeLeft <= 5 ? 'timer-critical' : ''}
              >
                {timeLeft}
              </span>
            </div>
          </div>
        </div>

        {/* Question Text */}
        <p style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-game)', lineHeight: 1.4, marginBottom: 0 }}>
          {q.prompt}
        </p>

        {/* Visual Diagram */}
        <VisualRenderer type={q.visualType} data={q.visualData} color={color} />
      </div>

      {/* ── Answer Options ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {q.options.map((opt, idx) => {
          const letter = ['A', 'B', 'C', 'D'][idx];
          const cls = getOptionClass(opt);
          const isCorrectOpt = revealed && opt === q.correctAnswer;
          const isWrongOpt = revealed && opt === selected && !isCorrectOpt;

          return (
            <button
              key={idx}
              disabled={revealed}
              onClick={() => { if (!revealed) handleSubmit(opt); }}
              className={`${cls} text-left`}
              style={{
                borderRadius: 22,
                padding: '14px 14px',
                minHeight: 72,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              {/* Letter tag */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 24, height: 24,
                    borderRadius: 8,
                    background: isCorrectOpt ? color : isWrongOpt ? 'var(--rose)' : 'var(--surface3)',
                    color: isCorrectOpt ? '#030a06' : isWrongOpt ? 'white' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800, fontFamily: 'var(--font-mono)',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }}
                >
                  {isCorrectOpt ? '✓' : isWrongOpt ? '✗' : letter}
                </span>
                <span
                  style={{
                    fontSize: 15, fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    color: isCorrectOpt ? color : isWrongOpt ? 'var(--rose)' : 'var(--text-primary)',
                    transition: 'color 0.2s',
                  }}
                >
                  {opt}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation Modal */}
      {explanationData && (
        <ExplanationModal question={explanationData.question} selected={explanationData.selected} onContinue={explanationData.onContinue} />
      )}
    </div>
  );
};

/* ── Visual Math Renderer ── */
const VisualRenderer = ({ type, data, color }) => {
  if (!data) return null;
  const c = color || '#00e5a0';

  const wrapStyle = {
    marginTop: 14,
    padding: 14,
    background: 'rgba(0,0,0,0.25)',
    borderRadius: 16,
    border: '1px solid rgba(255,255,255,0.05)',
  };

  if (type === 'fraction_pie') {
    const { numerator, denominator } = data;
    const sz = 64, r = 26, cx = sz / 2, cy = sz / 2;
    const slices = Array.from({ length: denominator }, (_, i) => {
      const a1 = (i / denominator) * 2 * Math.PI - Math.PI / 2;
      const a2 = ((i + 1) / denominator) * 2 * Math.PI - Math.PI / 2;
      const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
      const large = (1 / denominator) > 0.5 ? 1 : 0;
      return { d: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`, filled: i < numerator };
    });
    return (
      <div style={{ ...wrapStyle, display: 'flex', alignItems: 'center', gap: 12 }}>
        <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`} style={{ flexShrink: 0 }}>
          {slices.map((s, i) => <path key={i} d={s.d} fill={s.filled ? c : '#1d1f2b'} stroke="#08090e" strokeWidth="1.5" />)}
        </svg>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-game)', fontWeight: 700 }}>
          {numerator} out of {denominator} equal parts shaded
        </p>
      </div>
    );
  }

  if (type === 'fraction_bar') {
    const { num1 = 0, num2 = 0, denominator = 6 } = data;
    return (
      <div style={wrapStyle}>
        <div style={{ display: 'flex', gap: 3, height: 28 }}>
          {Array.from({ length: denominator }).map((_, i) => (
            <div key={i} style={{
              flex: 1, borderRadius: 6,
              background: i < num1 ? c : i < num1 + num2 ? 'var(--cyan)' : 'var(--surface3)',
              transition: 'background 0.2s',
            }} />
          ))}
        </div>
        <p style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 6 }}>Fraction Bar Model</p>
      </div>
    );
  }

  if (type === 'geom_shape') {
    const { shape, l, w, b, h, angleA, angleB } = data;
    if (shape === 'rectangle') return (
      <div style={{ ...wrapStyle, display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
        <div style={{ position: 'relative', width: 110, height: 62 }}>
          <div style={{ position: 'absolute', inset: 0, border: `2px solid ${c}`, borderRadius: 6, background: `${c}10` }} />
          <span style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', fontSize: 10, fontWeight: 800, color: c, fontFamily: 'var(--font-mono)', background: '#08090e', padding: '0 4px' }}>{l} cm</span>
          <span style={{ position: 'absolute', left: -28, top: '50%', transform: 'translateY(-50%)', fontSize: 10, fontWeight: 800, color: c, fontFamily: 'var(--font-mono)', background: '#08090e', padding: '0 4px' }}>{w} cm</span>
        </div>
      </div>
    );
    if (shape === 'angle_triangle') return (
      <div style={{ ...wrapStyle, textAlign: 'center' }}>
        <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--amber)', fontFamily: 'var(--font-mono)' }}>∠A={angleA}°, ∠B={angleB}°, ∠C=?</p>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-game)', marginTop: 4 }}>Sum of angles in a triangle = 180°</p>
      </div>
    );
    if (shape === 'triangle') return (
      <div style={{ ...wrapStyle, textAlign: 'center' }}>
        <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>base = {b} cm, height = {h} cm</p>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-game)', marginTop: 4 }}>Area = ½ × base × height</p>
      </div>
    );
  }

  if (type === 'pattern_boxes') {
    const { seq } = data;
    return (
      <div style={{ ...wrapStyle, display: 'flex', gap: 8, overflowX: 'auto' }}>
        {seq.map((item, i) => (
          <div key={i} style={{
            flexShrink: 0, width: 44, height: 44, borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: item === '?' ? `${c}15` : 'var(--surface3)',
            border: `2px solid ${item === '?' ? c : 'transparent'}`,
            fontSize: 15, fontWeight: 800, fontFamily: 'var(--font-mono)',
            color: item === '?' ? c : 'var(--text-primary)',
            animation: item === '?' ? 'timer-critical 1.2s ease-in-out infinite' : 'none',
          }}>
            {item}
          </div>
        ))}
      </div>
    );
  }

  if (type === 'symbol_puzzle') {
    const { eq1, eq2 } = data;
    return (
      <div style={{ ...wrapStyle, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[eq1, eq2].map((eq, i) => (
          <p key={i} style={{ fontSize: 15, fontWeight: 800, color: i === 0 ? c : 'var(--text-primary)', fontFamily: 'var(--font-mono)', margin: 0 }}>{eq}</p>
        ))}
      </div>
    );
  }

  return null;
};
