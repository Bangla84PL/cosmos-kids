/**
 * Achievement Checking System
 * Determines when children earn badges
 */

import type { Child, Achievement, Progress } from '@/lib/types/database';

export interface AchievementCheck {
  badgeSlug: string;
  earned: boolean;
  progress?: number; // Progress towards earning (0-100)
  description?: string;
}

/**
 * Check if a child should earn an achievement based on their progress
 */
export async function checkAchievements(
  child: Child,
  progressRecords: Progress[],
  existingAchievements: Achievement[]
): Promise<string[]> {
  const earnedBadgeSlugs: string[] = [];

  // Helper to check if already earned
  const hasAchievement = (slug: string) =>
    existingAchievements.some((a) => a.badge_id === slug);

  // First Steps - completed first activity
  if (!hasAchievement('first-steps') && progressRecords.length >= 1) {
    earnedBadgeSlugs.push('first-steps');
  }

  // Perfect Score - achieved 100% on any quiz
  if (!hasAchievement('perfect-score')) {
    const hasPerfectScore = progressRecords.some((p) => p.score === 100 && p.completed);
    if (hasPerfectScore) {
      earnedBadgeSlugs.push('perfect-score');
    }
  }

  // 7-Day Streak
  if (!hasAchievement('week-streak') && child.current_streak >= 7) {
    earnedBadgeSlugs.push('week-streak');
  }

  // 30-Day Streak
  if (!hasAchievement('month-streak') && child.current_streak >= 30) {
    earnedBadgeSlugs.push('month-streak');
  }

  // Level 10 - Rising Star
  if (!hasAchievement('level-10') && child.level >= 10) {
    earnedBadgeSlugs.push('level-10');
  }

  // Solar System Explorer - completed all Solar System activities
  // This would require checking module completion
  // Implementation depends on having module IDs in progress records

  // All Modules - Cosmic Scholar
  // Would require checking completion across all modules

  return earnedBadgeSlugs;
}

/**
 * Calculate progress towards specific achievements
 */
export function calculateAchievementProgress(
  child: Child,
  progressRecords: Progress[],
  badgeSlug: string
): number {
  switch (badgeSlug) {
    case 'first-steps':
      return progressRecords.length >= 1 ? 100 : (progressRecords.length / 1) * 100;

    case 'perfect-score': {
      const perfectScores = progressRecords.filter((p) => p.score === 100).length;
      return perfectScores >= 1 ? 100 : 0;
    }

    case 'week-streak':
      return Math.min(100, (child.current_streak / 7) * 100);

    case 'month-streak':
      return Math.min(100, (child.current_streak / 30) * 100);

    case 'level-10':
      return Math.min(100, (child.level / 10) * 100);

    case 'solar-system-explorer': {
      // Would need to check specific module completion
      // Placeholder logic
      const solarSystemActivities = progressRecords.filter((p) => p.completed);
      const totalSolarSystemActivities = 10; // This should come from module data
      return Math.min(
        100,
        (solarSystemActivities.length / totalSolarSystemActivities) * 100
      );
    }

    case 'all-modules': {
      // Would need to check all modules
      // Placeholder logic
      return 0;
    }

    default:
      return 0;
  }
}

/**
 * Get achievement status for display
 */
export interface AchievementStatus {
  slug: string;
  name: string;
  description: string;
  earned: boolean;
  progress: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  imageUrl: string;
}

/**
 * Badge definitions with descriptions
 * This should match the database seed data
 */
export const BADGE_DEFINITIONS = {
  'first-steps': {
    name: 'First Steps',
    description: 'Completed your first activity!',
    tier: 'bronze' as const,
    imageUrl: '/badges/first-steps.png',
  },
  'perfect-score': {
    name: 'Perfect Score',
    description: 'Achieved 100% on a quiz',
    tier: 'silver' as const,
    imageUrl: '/badges/perfect.png',
  },
  'week-streak': {
    name: '7-Day Streak',
    description: 'Logged in for 7 days in a row',
    tier: 'silver' as const,
    imageUrl: '/badges/streak-7.png',
  },
  'month-streak': {
    name: '30-Day Streak',
    description: 'Logged in for 30 days in a row',
    tier: 'gold' as const,
    imageUrl: '/badges/streak-30.png',
  },
  'level-10': {
    name: 'Rising Star',
    description: 'Reached Level 10',
    tier: 'silver' as const,
    imageUrl: '/badges/level-10.png',
  },
  'solar-system-explorer': {
    name: 'Solar System Explorer',
    description: 'Completed all Solar System activities',
    tier: 'gold' as const,
    imageUrl: '/badges/solar-system.png',
  },
  'all-modules': {
    name: 'Cosmic Scholar',
    description: 'Completed all learning modules',
    tier: 'platinum' as const,
    imageUrl: '/badges/scholar.png',
  },
};

/**
 * Get all achievement statuses for a child
 */
export function getAllAchievementStatuses(
  child: Child,
  progressRecords: Progress[],
  earnedAchievements: Achievement[]
): AchievementStatus[] {
  return Object.entries(BADGE_DEFINITIONS).map(([slug, badge]) => {
    const earned = earnedAchievements.some((a) => a.badge_id === slug);
    const progress = earned ? 100 : calculateAchievementProgress(child, progressRecords, slug);

    return {
      slug,
      name: badge.name,
      description: badge.description,
      earned,
      progress,
      tier: badge.tier,
      imageUrl: badge.imageUrl,
    };
  });
}

/**
 * Celebration messages for earning achievements
 */
export function getAchievementCelebrationMessage(badgeSlug: string): string {
  const messages: Record<string, string> = {
    'first-steps': '🎉 Amazing! You completed your first activity! Keep exploring, Space Explorer!',
    'perfect-score':
      '🌟 Incredible! A perfect score! Your knowledge of space is out of this world!',
    'week-streak':
      '🔥 Wow! 7 days in a row! You\'re on fire, astronaut! Keep that streak going!',
    'month-streak':
      '⭐ Unbelievable! 30 days straight! You\'re a true space explorer! NASA would be proud!',
    'level-10': '🚀 Level 10 reached! You\'re officially a Rising Star! The cosmos is yours!',
    'solar-system-explorer':
      '🪐 You\'ve explored the entire Solar System! You\'re now a certified Solar System Explorer!',
    'all-modules':
      '🌌 LEGENDARY! You\'ve mastered ALL the modules! You are a true Cosmic Scholar!',
  };

  return (
    messages[badgeSlug] ||
    '🎊 Congratulations! You earned a new achievement! Keep up the amazing work!'
  );
}
