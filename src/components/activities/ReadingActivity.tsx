'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import type { ReadingArticle, ReadingSection } from '@/lib/content/reading';
import { BookOpen, CheckCircle, Star, TrendingUp, Clock, Award } from 'lucide-react';

interface ReadingActivityProps {
  article: ReadingArticle;
  onComplete: (xpEarned: number) => void;
  childName: string;
}

export default function ReadingActivity({
  article,
  onComplete,
  childName,
}: ReadingActivityProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [readSections, setReadSections] = useState<boolean[]>(
    new Array(article.content.length).fill(false)
  );
  const [showCelebration, setShowCelebration] = useState(false);
  const [startTime] = useState(Date.now());
  const [readingTime, setReadingTime] = useState(0);

  const progress = ((currentSection + 1) / article.content.length) * 100;
  const allSectionsRead = readSections.every((read) => read);

  useEffect(() => {
    // Mark current section as read after a delay
    const timer = setTimeout(() => {
      if (!readSections[currentSection]) {
        const newReadSections = [...readSections];
        newReadSections[currentSection] = true;
        setReadSections(newReadSections);
      }
    }, 2000); // Consider a section "read" after 2 seconds

    return () => clearTimeout(timer);
  }, [currentSection, readSections]);

  const handleNext = () => {
    if (currentSection < article.content.length - 1) {
      setCurrentSection((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000); // seconds
    setReadingTime(timeSpent);
    setIsCompleted(true);
    setShowCelebration(true);
  };

  const handleFinish = () => {
    onComplete(article.xpReward);
  };

  const renderSection = (section: ReadingSection, index: number) => {
    switch (section.type) {
      case 'heading':
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <div className="flex items-center gap-3">
              {section.emoji && <span className="text-4xl">{section.emoji}</span>}
              <h3 className="text-h3 text-white">{section.content}</h3>
            </div>
          </motion.div>
        );

      case 'paragraph':
        return (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-body text-white/90 mb-4 leading-relaxed"
          >
            {section.content}
          </motion.p>
        );

      case 'callout':
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="my-6 p-4 rounded-lg bg-accent-orange/20 border-2 border-accent-orange/40"
          >
            <div className="flex items-start gap-3">
              {section.emoji && (
                <span className="text-3xl flex-shrink-0">{section.emoji}</span>
              )}
              <p className="text-body text-white font-medium">{section.content}</p>
            </div>
          </motion.div>
        );

      case 'list':
        return (
          <motion.ul
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3 mb-6 ml-4"
          >
            {Array.isArray(section.content) &&
              section.content.map((item, i) => {
                // Check if item contains markdown bold (**text**)
                const hasBold = item.includes('**');

                if (hasBold) {
                  // Simple markdown bold parsing
                  const parts = item.split('**');
                  return (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex items-start gap-3 text-body text-white/90"
                    >
                      <span className="text-brand-mint mt-1">•</span>
                      <span>
                        {parts.map((part, j) =>
                          j % 2 === 1 ? (
                            <strong key={j} className="font-bold text-white">
                              {part}
                            </strong>
                          ) : (
                            <span key={j}>{part}</span>
                          )
                        )}
                      </span>
                    </motion.li>
                  );
                }

                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-start gap-3 text-body text-white/90"
                  >
                    <span className="text-brand-mint mt-1">•</span>
                    <span>{item}</span>
                  </motion.li>
                );
              })}
          </motion.ul>
        );

      default:
        return null;
    }
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
            📚
          </motion.div>

          <h2 className="text-h1 text-white mb-4">Great Reading, {childName}!</h2>

          <p className="text-body-lg text-white/90 mb-6">
            You've finished reading "{article.title}"! You're learning so much about space!
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="glass-card p-4">
              <Clock className="w-8 h-8 text-brand-mint mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">
                {Math.floor(readingTime / 60)}:{(readingTime % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-body-sm text-white/80">Reading Time</div>
            </div>
            <div className="glass-card p-4">
              <Award className="w-8 h-8 text-accent-orange mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">+{article.xpReward}</div>
              <div className="text-body-sm text-white/80">XP Earned</div>
            </div>
          </div>

          {article.funFacts && article.funFacts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <h3 className="text-h4 text-white mb-4 flex items-center justify-center gap-2">
                <Star className="w-5 h-5 text-space-yellow" />
                Fun Facts You Learned
              </h3>
              <div className="space-y-3">
                {article.funFacts.map((fact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="glass-card p-3 text-left"
                  >
                    <p className="text-body-sm text-white/90">{fact}</p>
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

  if (isCompleted && allSectionsRead) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto"
      >
        <Card variant="glass-medium" className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-semantic-success mx-auto mb-4" />
          <h2 className="text-h2 text-white mb-4">You've finished reading!</h2>
          <p className="text-body-lg text-white/90 mb-6">
            Great job, {childName}! You read the entire article. Ready to see what you learned?
          </p>
          <Button variant="primary" size="lg" onClick={handleComplete}>
            See Results
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <Card variant="glass-medium" className="p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-brand-mint" />
              <Badge variant="info">
                {article.estimatedMinutes} min read
              </Badge>
              <Badge variant="default">Level {article.readingLevel}</Badge>
            </div>
            <h1 className="text-h2 text-white mb-2">{article.title}</h1>
            <p className="text-body text-white/80">{article.subtitle}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-body-sm text-white/90">
              Section {currentSection + 1} of {article.content.length}
            </span>
            <span className="text-body-sm text-white/90">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-mint to-accent-orange"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </Card>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card variant="glass" className="p-8 mb-6">
            {renderSection(article.content[currentSection], currentSection)}
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-4">
        <Button
          variant="ghost"
          onClick={handlePrevious}
          disabled={currentSection === 0}
          className="flex-1"
        >
          ← Previous
        </Button>
        {currentSection < article.content.length - 1 ? (
          <Button variant="primary" onClick={handleNext} className="flex-1">
            Next →
          </Button>
        ) : (
          <Button
            variant="accent"
            onClick={() => setIsCompleted(true)}
            className="flex-1"
            disabled={!allSectionsRead}
          >
            {allSectionsRead ? 'Finish Reading ✓' : 'Keep Reading...'}
          </Button>
        )}
      </div>

      {/* Encouragement */}
      <Card variant="glass" className="p-4 text-center mt-6">
        <p className="text-body-sm text-white/90">
          💡 Take your time, {childName}! Read carefully and think about what you're learning!
        </p>
      </Card>
    </div>
  );
}
