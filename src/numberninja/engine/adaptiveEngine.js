/**
 * Adaptive Difficulty Engine & Spaced Repetition State Tracker
 */

export class AdaptiveEngine {
  constructor(initialTier = 1) {
    this.currentTier = initialTier;
    this.history = []; // Array of { isCorrect: boolean, timeSeconds: number, topic: string }
    this.weakTopics = new Set();
  }

  // Record an answered question
  recordAnswer(isCorrect, timeSeconds, topic) {
    this.history.push({ isCorrect, timeSeconds, topic });

    if (!isCorrect && topic) {
      this.weakTopics.add(topic);
    }

    // Keep rolling window of last 5 questions
    if (this.history.length > 5) {
      this.history.shift();
    }

    this.evaluateMicroAdjustment();
  }

  // Micro-adjustment rules based on last 5 questions
  evaluateMicroAdjustment() {
    if (this.history.length < 3) return; // Need minimum 3 answers to evaluate

    const correctCount = this.history.filter(h => h.isCorrect).length;
    const accuracy = correctCount / this.history.length;
    const avgTime = this.history.reduce((sum, h) => sum + h.timeSeconds, 0) / this.history.length;

    // Fast & high accuracy (>= 80% correct, avg time < 8s) -> Increase Tier
    if (accuracy >= 0.8 && avgTime <= 8) {
      this.currentTier = Math.min(5, this.currentTier + 1);
    }
    // Low accuracy (<= 40%) -> Decrease Tier for gentler questions
    else if (accuracy <= 0.4) {
      this.currentTier = Math.max(1, this.currentTier - 1);
    }
  }

  getCurrentTier() {
    return this.currentTier;
  }

  getWeakTopics() {
    return Array.from(this.weakTopics);
  }

  clearWeakTopic(topic) {
    this.weakTopics.delete(topic);
  }

  resetSession(initialTier = 1) {
    this.currentTier = initialTier;
    this.history = [];
  }
}
