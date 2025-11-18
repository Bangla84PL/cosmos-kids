/**
 * XP and Leveling System
 * Handles all gamification calculations
 */

/**
 * Calculate level from total XP
 * Formula: level = floor(sqrt(xp / 100)) + 1
 *
 * XP Requirements per level:
 * Level 1: 0-99 XP
 * Level 2: 100-399 XP
 * Level 3: 400-899 XP
 * Level 4: 900-1599 XP
 * Level 5: 1600-2499 XP
 * Level 10: 8100-9999 XP
 * Level 20: 36100-39999 XP
 * Level 50: 240100-249999 XP
 */
export function calculateLevel(xp: number): number {
  return Math.max(1, Math.floor(Math.sqrt(xp / 100)) + 1);
}

/**
 * Calculate XP needed for next level
 */
export function xpForNextLevel(currentLevel: number): number {
  const nextLevel = currentLevel + 1;
  return (nextLevel - 1) ** 2 * 100;
}

/**
 * Calculate XP needed to reach current level
 */
export function xpForCurrentLevel(level: number): number {
  return (level - 1) ** 2 * 100;
}

/**
 * Calculate progress to next level as percentage
 */
export function calculateLevelProgress(totalXp: number): {
  currentLevel: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpInCurrentLevel: number;
  progressPercentage: number;
  xpToNextLevel: number;
} {
  const currentLevel = calculateLevel(totalXp);
  const xpCurrent = xpForCurrentLevel(currentLevel);
  const xpNext = xpForNextLevel(currentLevel);
  const xpInLevel = totalXp - xpCurrent;
  const xpNeeded = xpNext - xpCurrent;
  const progress = (xpInLevel / xpNeeded) * 100;

  return {
    currentLevel,
    xpForCurrentLevel: xpCurrent,
    xpForNextLevel: xpNext,
    xpInCurrentLevel: xpInLevel,
    progressPercentage: Math.min(100, Math.round(progress)),
    xpToNextLevel: xpNext - totalXp,
  };
}

/**
 * XP Rewards for different activities
 */
export const XP_REWARDS = {
  // Activity completion
  QUIZ_CORRECT_ANSWER: 10,
  QUIZ_PERFECT_SCORE_BONUS: 50,
  VIDEO_WATCHED: 15,
  READING_COMPLETED: 20,
  GAME_COMPLETED: 25,
  CREATIVE_ACTIVITY: 30,

  // Engagement bonuses
  DAILY_LOGIN: 5,
  STREAK_3_DAYS: 10,
  STREAK_7_DAYS: 25,
  STREAK_30_DAYS: 100,

  // Module completion
  MODULE_COMPLETION: 100,
  ALL_MODULES_COMPLETION: 500,

  // Achievements
  FIRST_ACTIVITY: 20,
  FIRST_PERFECT_SCORE: 50,
  TENTH_ACTIVITY: 50,
  HUNDREDTH_ACTIVITY: 200,
};

/**
 * Get rank name based on level
 */
export function getRankName(level: number): string {
  if (level >= 51) return 'Galactic Legend';
  if (level >= 31) return 'Commander';
  if (level >= 21) return 'Mission Specialist';
  if (level >= 11) return 'Astronaut';
  if (level >= 6) return 'Space Explorer';
  return 'Cadet';
}

/**
 * Get rank icon emoji based on level
 */
export function getRankIcon(level: number): string {
  if (level >= 51) return '🌌';
  if (level >= 31) return '👨‍🚀';
  if (level >= 21) return '🚀';
  if (level >= 11) return '🛸';
  if (level >= 6) return '⭐';
  return '🎓';
}

/**
 * Calculate streak XP bonus
 */
export function calculateStreakBonus(streakDays: number): number {
  if (streakDays >= 30) return XP_REWARDS.STREAK_30_DAYS;
  if (streakDays >= 7) return XP_REWARDS.STREAK_7_DAYS;
  if (streakDays >= 3) return XP_REWARDS.STREAK_3_DAYS;
  return 0;
}

/**
 * Check if level up occurred
 */
export function checkLevelUp(oldXp: number, newXp: number): {
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
  levelsGained: number;
} {
  const oldLevel = calculateLevel(oldXp);
  const newLevel = calculateLevel(newXp);
  const leveledUp = newLevel > oldLevel;

  return {
    leveledUp,
    oldLevel,
    newLevel,
    levelsGained: newLevel - oldLevel,
  };
}

/**
 * Activity type to XP reward mapping
 */
export function getActivityXpReward(activityType: string, score?: number): number {
  switch (activityType) {
    case 'quiz':
      if (score !== undefined) {
        const baseXp = Math.round((score / 100) * 50);
        const perfectBonus = score === 100 ? XP_REWARDS.QUIZ_PERFECT_SCORE_BONUS : 0;
        return baseXp + perfectBonus;
      }
      return XP_REWARDS.QUIZ_CORRECT_ANSWER;
    case 'video':
      return XP_REWARDS.VIDEO_WATCHED;
    case 'reading':
      return XP_REWARDS.READING_COMPLETED;
    case 'game':
      return XP_REWARDS.GAME_COMPLETED;
    case 'creative':
      return XP_REWARDS.CREATIVE_ACTIVITY;
    default:
      return 10;
  }
}
