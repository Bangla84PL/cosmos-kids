'use client';

import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Trophy, Lock, CheckCircle, Star } from 'lucide-react';
import type { Badge as BadgeType } from '@/lib/types/database';

interface Achievement {
  badge_slug: string;
  earned_at: string;
}

interface AchievementDisplayProps {
  achievements: Achievement[];
  allBadges: BadgeType[];
  compact?: boolean;
}

export default function AchievementDisplay({
  achievements,
  allBadges,
  compact = false,
}: AchievementDisplayProps) {
  const earnedSlugs = new Set(achievements.map((a) => a.badge_slug));

  const sortedBadges = [...allBadges].sort((a, b) => {
    const aEarned = earnedSlugs.has(a.slug);
    const bEarned = earnedSlugs.has(b.slug);
    if (aEarned && !bEarned) return -1;
    if (!aEarned && bEarned) return 1;
    return 0;
  });

  const earnedCount = achievements.length;
  const totalCount = allBadges.length;
  const progressPercent = (earnedCount / totalCount) * 100;

  if (compact) {
    return (
      <Card variant="glass-medium" className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent-orange" />
            <h3 className="text-h4 text-white">Achievements</h3>
          </div>
          <Badge variant="success">
            {earnedCount}/{totalCount}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-mint to-accent-orange"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-4 gap-2">
          {sortedBadges.slice(0, 8).map((badge) => {
            const isEarned = earnedSlugs.has(badge.slug);
            return (
              <motion.div
                key={badge.id}
                whileHover={{ scale: isEarned ? 1.1 : 1 }}
                className={`
                  aspect-square rounded-lg p-2 flex items-center justify-center text-4xl
                  ${
                    isEarned
                      ? 'bg-accent-orange/20 border-2 border-accent-orange'
                      : 'bg-white/10 border-2 border-white/20 opacity-40'
                  }
                `}
                title={badge.name}
              >
                {isEarned ? (
                  '🏆'
                ) : (
                  <Lock className="w-6 h-6 text-white/50" />
                )}
              </motion.div>
            );
          })}
        </div>

        {totalCount > 8 && (
          <p className="text-body-sm text-white/70 text-center mt-3">
            +{totalCount - 8} more to discover!
          </p>
        )}
      </Card>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-h2 text-white mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-accent-orange" />
            Achievements
          </h2>
          <p className="text-body text-white/80">
            Collect badges by completing activities and reaching milestones!
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-white mb-1">
            {earnedCount}/{totalCount}
          </div>
          <div className="text-body-sm text-white/80">Badges Earned</div>
        </div>
      </div>

      {/* Progress Bar */}
      <Card variant="glass-medium" className="p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-body text-white">Overall Progress</span>
          <span className="text-body font-medium text-white">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-mint via-accent-orange to-space-purple"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </div>
      </Card>

      {/* Badge Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedBadges.map((badge, index) => {
          const isEarned = earnedSlugs.has(badge.slug);
          const achievement = achievements.find((a) => a.badge_slug === badge.slug);

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                variant={isEarned ? 'glass-medium' : 'glass'}
                className={`p-6 relative ${!isEarned && 'opacity-60'}`}
                hover={isEarned}
              >
                {/* Badge Icon */}
                <div
                  className={`
                  w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl
                  ${
                    isEarned
                      ? 'bg-accent-orange/30 border-4 border-accent-orange shadow-lg shadow-accent-orange/50'
                      : 'bg-white/10 border-4 border-white/20'
                  }
                `}
                >
                  {isEarned ? (
                    '🏆'
                  ) : (
                    <Lock className="w-10 h-10 text-white/50" />
                  )}
                </div>

                {/* Badge Name */}
                <h3 className={`text-h4 text-center mb-2 ${isEarned ? 'text-white' : 'text-white/60'}`}>
                  {badge.name}
                </h3>

                {/* Badge Description */}
                <p className={`text-body-sm text-center mb-3 ${isEarned ? 'text-white/80' : 'text-white/50'}`}>
                  {badge.description}
                </p>

                {/* Requirements */}
                <div className="text-center">
                  {isEarned ? (
                    <div className="flex items-center justify-center gap-2 text-semantic-success">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-body-sm">Unlocked!</span>
                    </div>
                  ) : (
                    <div className="text-body-sm text-white/60">
                      Complete activities to unlock
                    </div>
                  )}
                </div>

                {/* Earned Date */}
                {isEarned && achievement && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-center gap-2 text-white/70">
                      <Star className="w-4 h-4" />
                      <span className="text-body-sm">
                        Earned {new Date(achievement.earned_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Locked Overlay Effect */}
                {!isEarned && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10 rounded-lg pointer-events-none"
                    animate={{
                      opacity: [0.5, 0.3, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Encouragement */}
      {earnedCount < totalCount && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card variant="glass" className="p-6 mt-6 text-center">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="text-h3 text-white mb-2">Keep Exploring!</h3>
            <p className="text-body text-white/80">
              You have {totalCount - earnedCount} more badge{totalCount - earnedCount > 1 ? 's' : ''} to unlock.
              Complete activities and reach milestones to earn them all!
            </p>
          </Card>
        </motion.div>
      )}

      {/* All Unlocked Celebration */}
      {earnedCount === totalCount && totalCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
        >
          <Card variant="glass-heavy" className="p-8 mt-6 text-center bg-gradient-to-br from-accent-orange/20 to-space-purple/20 border-2 border-accent-orange">
            <div className="text-8xl mb-4">🏆</div>
            <h3 className="text-h1 text-white mb-3">Master Collector!</h3>
            <p className="text-body-lg text-white/90 mb-4">
              Incredible! You've unlocked ALL {totalCount} badges! You're a true space exploration expert!
            </p>
            <div className="flex justify-center gap-2">
              <Badge variant="success" className="text-lg px-4 py-2">
                <Star className="w-5 h-5 mr-2" />
                100% Complete
              </Badge>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
