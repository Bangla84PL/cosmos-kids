'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import type { QuizQuestion } from '@/lib/content/quizzes';
import { CheckCircle, XCircle, Star, TrendingUp } from 'lucide-react';

interface QuizActivityProps {
  questions: QuizQuestion[];
  onComplete: (score: number, correctCount: number, totalQuestions: number) => void;
  childName: string;
}

export default function QuizActivity({ questions, onComplete, childName }: QuizActivityProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    if (answerIndex === currentQuestion.correctAnswer) {
      setCorrectAnswers((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const handleComplete = () => {
    const score = Math.round((correctAnswers / questions.length) * 100);
    onComplete(score, correctAnswers, questions.length);
  };

  if (showResults) {
    const score = Math.round((correctAnswers / questions.length) * 100);
    const isPerfect = score === 100;
    const isGreat = score >= 80;
    const isGood = score >= 60;

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
            {isPerfect ? '🌟' : isGreat ? '🚀' : isGood ? '⭐' : '💫'}
          </motion.div>

          <h2 className="text-h1 text-white mb-4">
            {isPerfect && 'Perfect Score!'}
            {isGreat && !isPerfect && 'Great Job!'}
            {isGood && !isGreat && 'Good Work!'}
            {!isGood && 'Nice Try!'}
          </h2>

          <p className="text-body-lg text-white/90 mb-6">
            {isPerfect &&
              `${childName}, you got every question right! You're a space genius! 🎉`}
            {isGreat &&
              !isPerfect &&
              `${childName}, you really know your space facts! Keep exploring! 🌠`}
            {isGood && !isGreat && `${childName}, you're learning a lot! Keep going! ✨`}
            {!isGood && `${childName}, keep practicing and you'll be a space expert soon! 🌟`}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="glass-card p-4">
              <div className="text-4xl font-bold text-white mb-2">{score}%</div>
              <div className="text-body-sm text-white/80">Score</div>
            </div>
            <div className="glass-card p-4">
              <div className="text-4xl font-bold text-white mb-2">
                {correctAnswers}/{questions.length}
              </div>
              <div className="text-body-sm text-white/80">Correct</div>
            </div>
          </div>

          {isPerfect && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-4 mb-6 bg-accent-orange/20 border-accent-orange"
            >
              <Star className="w-6 h-6 text-accent-orange inline mr-2" />
              <span className="text-white font-medium">
                Bonus XP for perfect score! +50 XP
              </span>
            </motion.div>
          )}

          <Button variant="accent" size="lg" onClick={handleComplete} className="w-full">
            <TrendingUp className="w-5 h-5 mr-2" />
            Collect Your XP!
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-body-sm text-white/90">
            Question {currentQuestionIndex + 1} of {questions.length}
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

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card variant="glass-medium" className="p-8 mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent-orange flex items-center justify-center text-white font-bold text-xl">
                {currentQuestionIndex + 1}
              </div>
              <h3 className="text-h3 text-white flex-1">{currentQuestion.question}</h3>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectAnswer = index === currentQuestion.correctAnswer;
                const showCorrect = isAnswered && isCorrectAnswer;
                const showWrong = isAnswered && isSelected && !isCorrect;

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      showCorrect
                        ? 'bg-semantic-success/30 border-2 border-semantic-success'
                        : showWrong
                          ? 'bg-semantic-error/30 border-2 border-semantic-error'
                          : isSelected
                            ? 'bg-brand-mint/30 border-2 border-brand-mint'
                            : 'bg-white/10 border-2 border-white/20 hover:bg-white/20 hover:border-white/40'
                    } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    whileHover={!isAnswered ? { scale: 1.02 } : {}}
                    whileTap={!isAnswered ? { scale: 0.98 } : {}}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-body text-white font-medium">{option}</span>
                      {showCorrect && <CheckCircle className="w-6 h-6 text-semantic-success" />}
                      {showWrong && <XCircle className="w-6 h-6 text-semantic-error" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 p-4 rounded-lg bg-white/10 border border-white/20"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-2xl">
                    {isCorrect ? '✅' : '💡'}
                  </div>
                  <div>
                    <p className="text-body-sm font-medium text-white mb-1">
                      {isCorrect ? 'Correct!' : 'Not quite!'}
                    </p>
                    <p className="text-body-sm text-white/90">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </Card>

          {/* Next Button */}
          {isAnswered && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button variant="primary" size="lg" onClick={handleNext} className="w-full">
                {currentQuestionIndex < questions.length - 1
                  ? 'Next Question →'
                  : 'See Results 🎉'}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Fun Encouragement */}
      {!isAnswered && (
        <Card variant="glass" className="p-4 text-center">
          <p className="text-body-sm text-white/90">
            💡 Take your time, {childName}! There's no rush. Think about what you've learned!
          </p>
        </Card>
      )}
    </div>
  );
}
