'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import type { VideoContent } from '@/lib/content/videos';
import { Play, CheckCircle, Star, TrendingUp, Clock, Award, MessageCircle } from 'lucide-react';

interface VideoActivityProps {
  video: VideoContent;
  onComplete: (xpEarned: number) => void;
  childName: string;
}

export default function VideoActivity({ video, onComplete, childName }: VideoActivityProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const [hasWatchedEnough, setHasWatchedEnough] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState<number | null>(null);
  const watchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Track watch time
  useEffect(() => {
    if (isPlaying) {
      watchTimerRef.current = setInterval(() => {
        setWatchTime((prev) => {
          const newTime = prev + 1;
          // Consider video "watched" after 70% of duration
          const requiredTime = video.durationMinutes * 60 * 0.7;
          if (newTime >= requiredTime && !hasWatchedEnough) {
            setHasWatchedEnough(true);
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (watchTimerRef.current) {
        clearInterval(watchTimerRef.current);
      }
    }

    return () => {
      if (watchTimerRef.current) {
        clearInterval(watchTimerRef.current);
      }
    };
  }, [isPlaying, video.durationMinutes, hasWatchedEnough]);

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setHasWatchedEnough(true);
  };

  const handleComplete = () => {
    setIsCompleted(true);
    setShowCelebration(true);
  };

  const handleFinish = () => {
    onComplete(video.xpReward);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showCelebration) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <Card variant="glass-heavy" className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-8xl mb-6"
          >
            🎬
          </motion.div>

          <h2 className="text-h1 text-white mb-4">Awesome, {childName}!</h2>

          <p className="text-body-lg text-white/90 mb-6">
            You watched "{video.title}" and learned so much! Keep exploring space!
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="glass-card p-4">
              <Clock className="w-8 h-8 text-brand-mint mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">{formatTime(watchTime)}</div>
              <div className="text-body-sm text-white/80">Watch Time</div>
            </div>
            <div className="glass-card p-4">
              <Award className="w-8 h-8 text-accent-orange mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">+{video.xpReward}</div>
              <div className="text-body-sm text-white/80">XP Earned</div>
            </div>
          </div>

          {video.learningObjectives && video.learningObjectives.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6 text-left"
            >
              <h3 className="text-h4 text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-space-yellow" />
                What You Learned
              </h3>
              <div className="space-y-2">
                {video.learningObjectives.map((objective, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-3 glass-card p-3"
                  >
                    <CheckCircle className="w-5 h-5 text-semantic-success flex-shrink-0 mt-0.5" />
                    <p className="text-body-sm text-white/90">{objective}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <Button variant="accent" size="lg" onClick={handleFinish} className="w-full">
            <TrendingUp className="w-5 h-5 mr-2" />
            Collect Your XP!
          </Button>
        </Card>
      </motion.div>
    );
  }

  if (isCompleted && hasWatchedEnough) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto"
      >
        <Card variant="glass-medium" className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-semantic-success mx-auto mb-4" />
          <h2 className="text-h2 text-white mb-4">Great job watching!</h2>
          <p className="text-body-lg text-white/90 mb-6">
            You finished the video, {childName}! Ready to see what you learned?
          </p>
          <Button variant="primary" size="lg" onClick={handleComplete}>
            See Results
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <Card variant="glass-medium" className="p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Play className="w-5 h-5 text-brand-mint" />
              <Badge variant="info">{video.durationMinutes} minutes</Badge>
              <Badge variant="default">Level {video.ageLevel}</Badge>
            </div>
            <h1 className="text-h2 text-white mb-2">{video.title}</h1>
            <p className="text-body text-white/80">{video.description}</p>
          </div>
        </div>

        {/* Topics */}
        {video.topics && video.topics.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {video.topics.map((topic, index) => (
              <Badge key={index} variant="default">
                {topic}
              </Badge>
            ))}
          </div>
        )}
      </Card>

      {/* Video Player */}
      <Card variant="glass-heavy" className="mb-6 overflow-hidden">
        <div className="aspect-video bg-black/50">
          {video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be') ? (
            <iframe
              src={video.videoUrl}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={handleVideoEnd}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/50">
              <div className="text-center">
                <Play className="w-16 h-16 mx-auto mb-4" />
                <p className="text-body">Video player</p>
                <p className="text-body-sm mt-2">{video.videoUrl}</p>
              </div>
            </div>
          )}
        </div>

        {/* Watch Progress */}
        {watchTime > 0 && (
          <div className="p-4 bg-black/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-body-sm text-white/90">
                Watch Time: {formatTime(watchTime)} / {video.durationMinutes}:00
              </span>
              <span className="text-body-sm text-white/90">
                {hasWatchedEnough ? '✓ Completed' : 'Keep watching...'}
              </span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${
                  hasWatchedEnough
                    ? 'bg-semantic-success'
                    : 'bg-gradient-to-r from-brand-mint to-accent-orange'
                }`}
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(100, (watchTime / (video.durationMinutes * 60)) * 100)}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Learning Objectives */}
      {video.learningObjectives && video.learningObjectives.length > 0 && (
        <Card variant="glass-medium" className="p-6 mb-6">
          <h3 className="text-h3 text-white mb-4 flex items-center gap-2">
            <Star className="w-6 h-6 text-space-yellow" />
            What You'll Learn
          </h3>
          <div className="space-y-3">
            {video.learningObjectives.map((objective, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-brand-mint flex-shrink-0 mt-1" />
                <p className="text-body text-white/90">{objective}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Discussion Questions */}
      {video.discussionQuestions && video.discussionQuestions.length > 0 && (
        <Card variant="glass-medium" className="p-6 mb-6">
          <h3 className="text-h3 text-white mb-4 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-accent-orange" />
            Think About It
          </h3>
          <p className="text-body-sm text-white/80 mb-4">
            After watching, think about these questions! You can discuss them with your parents or
            friends.
          </p>
          <div className="space-y-3">
            {video.discussionQuestions.map((question, index) => (
              <motion.button
                key={index}
                onClick={() => setSelectedDiscussion(selectedDiscussion === index ? null : index)}
                className={`w-full text-left p-4 rounded-lg transition-all ${
                  selectedDiscussion === index
                    ? 'bg-accent-orange/30 border-2 border-accent-orange'
                    : 'bg-white/10 border-2 border-white/20 hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-orange text-white text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <p className="text-body text-white font-medium flex-1">{question}</p>
                </div>
                {selectedDiscussion === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 ml-9 text-body-sm text-white/80"
                  >
                    💭 This is a great question to discuss! There's no wrong answer - just think
                    about what you learned from the video.
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </Card>
      )}

      {/* Complete Button */}
      {hasWatchedEnough && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Button
            variant="accent"
            size="lg"
            onClick={() => setIsCompleted(true)}
            className="w-full"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            I've Finished Watching!
          </Button>
        </motion.div>
      )}

      {/* Encouragement */}
      {!hasWatchedEnough && (
        <Card variant="glass" className="p-4 text-center">
          <p className="text-body-sm text-white/90">
            🎥 Enjoy the video, {childName}! Pay attention and you'll learn amazing things about
            space!
          </p>
        </Card>
      )}
    </div>
  );
}
