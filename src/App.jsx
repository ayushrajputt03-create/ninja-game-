import React, { useState, useEffect } from 'react';
import { loadProgress, saveProgress, recordLevelCompletion, resetProgress } from './numberninja/utils/storage';
import { LEVELS } from './numberninja/data/levelsData';
import { Header } from './numberninja/components/Header';
import { WorldMap } from './numberninja/components/WorldMap';
import { GameplayScreen } from './numberninja/components/GameplayScreen';
import { LevelSummaryModal } from './numberninja/components/LevelSummaryModal';
import { CertificateModal } from './numberninja/components/CertificateModal';
import { DailyChallengeModal } from './numberninja/components/DailyChallengeModal';
import { MobileBottomNav } from './numberninja/components/MobileBottomNav';
import { MobileDeviceFrame } from './numberninja/components/MobileDeviceFrame';
import { sounds } from './numberninja/engine/soundEngine';
import './numberninja/ninja.css';
import './app.css';

export default function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [viewState, setViewState] = useState('map'); // 'map' | 'play'
  const [activeLevel, setActiveLevel] = useState(null);
  const [isMuted, setIsMuted] = useState(sounds.isMuted);

  // Modals state
  const [levelSummary, setLevelSummary] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showDailyChallenge, setShowDailyChallenge] = useState(false);

  // Sync progress state on changes
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Sound toggle callback
  const handleToggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    if (!muted) sounds.playClick();
  };

  // Handle selecting a level from WorldMap
  const handleSelectLevel = (level) => {
    setActiveLevel(level);
    setViewState('play');
    setLevelSummary(null);
  };

  // Handle quick play / continue
  const handleContinueLevel = () => {
    const maxUnlockedId = Math.max(...progress.unlockedLevels);
    const targetLvl = LEVELS.find(l => l.id === maxUnlockedId) || LEVELS[0];
    handleSelectLevel(targetLvl);
  };

  // Handle level completion from GameplayScreen
  const handleFinishLevel = ({ level, accuracyPct, isMastered, maxCombo, weakTopicsRecorded }) => {
    const xpEarned = isMastered ? level.xpReward + (maxCombo * 10) : 25;
    const updatedState = recordLevelCompletion(level.id, accuracyPct, isMastered, xpEarned, weakTopicsRecorded);
    
    setProgress(updatedState);
    setLevelSummary({
      level,
      accuracyPct,
      isMastered,
      maxCombo,
      weakTopicsRecorded
    });
  };

  // Action: Retry level
  const handleRetryLevel = () => {
    const current = activeLevel;
    setLevelSummary(null);
    setActiveLevel(null);
    setTimeout(() => {
      setActiveLevel(current);
    }, 50);
  };

  // Action: Next level
  const handleNextLevel = () => {
    if (!activeLevel) return;
    const nextId = activeLevel.id + 1;
    const nextLvl = LEVELS.find(l => l.id === nextId);
    setLevelSummary(null);
    if (nextLvl && progress.unlockedLevels.includes(nextId)) {
      setActiveLevel(nextLvl);
    } else {
      setViewState('map');
    }
  };

  // Action: Reset progress
  const handleResetProgress = () => {
    const wiped = resetProgress();
    setProgress(wiped);
    setViewState('map');
    setActiveLevel(null);
    setLevelSummary(null);
  };

  // Action: Start Daily Challenge
  const handleStartDailyChallenge = () => {
    setShowDailyChallenge(false);
    const dailyLevel = {
      id: 999,
      worldId: 10,
      levelInWorld: 10,
      topic: 'mixed',
      title: "Today's Daily Classroom Challenge",
      masteryThreshold: 80,
      timeLimitPerQuestion: 15,
      questionCount: 5,
      difficultyTier: 3,
      isBoss: true,
      xpReward: 300
    };
    handleSelectLevel(dailyLevel);
  };

  return (
    <MobileDeviceFrame>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans select-none flex flex-col antialiased pb-20 md:pb-0 pt-[env(safe-area-inset-top)]">
        
        {/* Navigation & Stats Header */}
        <Header 
          progress={progress}
          onResetProgress={handleResetProgress}
          onOpenCertificate={() => setShowCertificate(true)}
          onOpenDailyChallenge={() => setShowDailyChallenge(true)}
        />

        {/* Main Workspace View */}
        <main className="flex-1 pb-12">
          {viewState === 'map' && (
            <WorldMap 
              progress={progress}
              onSelectLevel={handleSelectLevel}
              onOpenCertificate={() => setShowCertificate(true)}
            />
          )}

          {viewState === 'play' && activeLevel && (
            <GameplayScreen 
              level={activeLevel}
              weakTopics={progress.weakTopics}
              onFinishLevel={handleFinishLevel}
              onBackToMap={() => {
                setViewState('map');
                setActiveLevel(null);
              }}
            />
          )}
        </main>

        {/* Floating Mobile Bottom Dock (iPhone / Android Mobile Viewports) */}
        <MobileBottomNav
          viewState={viewState}
          onGoToMap={() => {
            setViewState('map');
            setActiveLevel(null);
          }}
          onContinueLevel={handleContinueLevel}
          onOpenDailyChallenge={() => setShowDailyChallenge(true)}
          onOpenCertificate={() => setShowCertificate(true)}
          isMuted={isMuted}
          onToggleSound={handleToggleSound}
        />

        {/* End-of-Level Summary Modal */}
        {levelSummary && (
          <LevelSummaryModal 
            summary={levelSummary}
            onRetryLevel={handleRetryLevel}
            onNextLevel={handleNextLevel}
            onBackToMap={() => {
              setLevelSummary(null);
              setViewState('map');
              setActiveLevel(null);
            }}
            onOpenCertificate={() => {
              setLevelSummary(null);
              setShowCertificate(true);
            }}
          />
        )}

        {/* Certificate Modal */}
        {showCertificate && (
          <CertificateModal 
            progress={progress}
            onClose={() => setShowCertificate(false)}
          />
        )}

        {/* Daily Challenge Modal */}
        {showDailyChallenge && (
          <DailyChallengeModal 
            onStartChallenge={handleStartDailyChallenge}
            onClose={() => setShowDailyChallenge(false)}
          />
        )}

        {/* Footer Branding */}
        <footer className="py-4 border-t border-slate-900 text-center text-xs text-slate-500 font-mono hidden md:block">
          <p>Number Ninja v2.0 • iOS & Android Mobile Native PWA • 100% Client-Side</p>
        </footer>

      </div>
    </MobileDeviceFrame>
  );
}
