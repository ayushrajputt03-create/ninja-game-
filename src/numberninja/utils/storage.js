const STORAGE_KEY = 'number_ninja_v2_progress';

const DEFAULT_STATE = {
  unlockedLevels: [1], // Level 1 starts unlocked
  masteredLevels: [],  // Level IDs that passed mastery threshold
  levelScores: {},     // levelId -> { accuracyPct, stars, bestTime }
  totalXp: 0,
  weakTopics: [],
  playerName: 'Ninja Scholar',
  maxWorldUnlocked: 1
};

export function loadProgress() {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      unlockedLevels: Array.isArray(parsed.unlockedLevels) && parsed.unlockedLevels.length > 0 ? parsed.unlockedLevels : [1],
      masteredLevels: Array.isArray(parsed.masteredLevels) ? parsed.masteredLevels : []
    };
  } catch (err) {
    console.error("Failed to load Number Ninja progress:", err);
    return DEFAULT_STATE;
  }
}

export function saveProgress(state) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Failed to save Number Ninja progress:", err);
  }
}

export function recordLevelCompletion(levelId, accuracyPct, isMastered, xpEarned, weakTopicList = []) {
  const current = loadProgress();

  const prevScore = current.levelScores[levelId] || { accuracyPct: 0, stars: 0 };
  const stars = accuracyPct >= 95 ? 3 : accuracyPct >= 85 ? 2 : accuracyPct >= 80 ? 1 : 0;

  // Update level score if improved
  const updatedScores = {
    ...current.levelScores,
    [levelId]: {
      accuracyPct: Math.max(prevScore.accuracyPct, accuracyPct),
      stars: Math.max(prevScore.stars, stars),
      lastAttemptDate: new Date().toISOString()
    }
  };

  // Update mastered levels array
  const masteredSet = new Set(current.masteredLevels);
  if (isMastered) {
    masteredSet.add(levelId);
  }

  // Next level unlock logic: unlock levelId + 1 if levelId is mastered
  const unlockedSet = new Set(current.unlockedLevels);
  if (isMastered && levelId < 100) {
    unlockedSet.add(levelId + 1);
  }

  // Update max world unlocked
  const maxUnlockedLevel = Math.max(...Array.from(unlockedSet));
  const maxWorld = Math.min(10, Math.ceil(maxUnlockedLevel / 10));

  // XP accumulation (award XP once or top up)
  const isFirstMastery = isMastered && !current.masteredLevels.includes(levelId);
  const updatedXp = current.totalXp + (isFirstMastery ? xpEarned : Math.round(xpEarned * 0.25));

  // Merge weak topics
  const mergedWeakTopics = Array.from(new Set([...current.weakTopics, ...weakTopicList]));

  const newState = {
    ...current,
    unlockedLevels: Array.from(unlockedSet),
    masteredLevels: Array.from(masteredSet),
    levelScores: updatedScores,
    totalXp: updatedXp,
    weakTopics: mergedWeakTopics,
    maxWorldUnlocked: maxWorld
  };

  saveProgress(newState);
  return newState;
}

export function resetProgress() {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  localStorage.removeItem(STORAGE_KEY);
  return DEFAULT_STATE;
}
