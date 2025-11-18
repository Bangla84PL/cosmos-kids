'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Child, Module } from '@/lib/types/database';
import { getRandomQuizQuestions } from '@/lib/content/quizzes';
import { getRandomPlanetFacts } from '@/lib/content/planets';
import { getRandomAstronauts } from '@/lib/content/astronauts';
import { getReadingArticlesByModule } from '@/lib/content/reading';
import { getVideosByModule } from '@/lib/content/videos';
import QuizActivity from '@/components/activities/QuizActivity';
import ReadingActivity from '@/components/activities/ReadingActivity';
import VideoActivity from '@/components/activities/VideoActivity';
import LevelUpModal from '@/components/gamification/LevelUpModal';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ArrowLeft, BookOpen, Video, HelpCircle, Sparkles, Trophy } from 'lucide-react';
import Link from 'next/link';
import type { ReadingArticle } from '@/lib/content/reading';
import type { VideoContent } from '@/lib/content/videos';
import { calculateLevel } from '@/lib/gamification/xp';

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const childId = params.childId as string;
  const moduleSlug = params.moduleSlug as string;
  const [child, setChild] = useState<Child | null>(null);
  const [module, setModule] = useState<Module | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentActivity, setCurrentActivity] = useState<
    'none' | 'quiz' | 'reading' | 'video'
  >('none');
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [selectedReading, setSelectedReading] = useState<ReadingArticle | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(null);
  const [availableReadings, setAvailableReadings] = useState<ReadingArticle[]>([]);
  const [availableVideos, setAvailableVideos] = useState<VideoContent[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [oldXp, setOldXp] = useState(0);
  const [newXp, setNewXp] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      // Fetch child
      const { data: childData } = await supabase
        .from('cosmoskids_children')
        .select('*')
        .eq('id', childId)
        .single();

      // Fetch module
      const { data: moduleData } = await supabase
        .from('cosmoskids_modules')
        .select('*')
        .eq('slug', moduleSlug)
        .single();

      if (childData) {
        setChild(childData);
        // Load age-appropriate content
        const readings = getReadingArticlesByModule(moduleSlug);
        const videos = getVideosByModule(moduleSlug);
        setAvailableReadings(readings);
        setAvailableVideos(videos);
      }
      if (moduleData) setModule(moduleData);
      setIsLoading(false);
    }

    fetchData();
  }, [supabase, childId, moduleSlug]);

  const handleStartQuiz = () => {
    const questions = getRandomQuizQuestions(moduleSlug, 5);
    setQuizQuestions(questions);
    setCurrentActivity('quiz');
  };

  const handleStartReading = (article: ReadingArticle) => {
    setSelectedReading(article);
    setCurrentActivity('reading');
  };

  const handleStartVideo = (video: VideoContent) => {
    setSelectedVideo(video);
    setCurrentActivity('video');
  };

  const handleActivityComplete = async (
    activityType: 'quiz' | 'reading' | 'video',
    xpEarned: number,
    additionalData?: any
  ) => {
    if (!child || !module) return;

    const previousXp = child.total_xp;
    const updatedXp = previousXp + xpEarned;
    const previousLevel = calculateLevel(previousXp);
    const updatedLevel = calculateLevel(updatedXp);

    // Update child's XP in database
    const { data: updatedChild } = await supabase
      .from('cosmoskids_children')
      .update({
        total_xp: updatedXp,
      })
      .eq('id', childId)
      .select()
      .single();

    if (updatedChild) {
      setChild(updatedChild);
    }

    // Record progress in database
    await supabase.from('cosmoskids_progress').insert({
      child_id: childId,
      module_id: module.id,
      activity_type: activityType,
      score: additionalData?.score || 100,
      xp_earned: xpEarned,
      completed_at: new Date().toISOString(),
    });

    // Check for level up
    if (updatedLevel > previousLevel) {
      setOldXp(previousXp);
      setNewXp(updatedXp);
      setShowLevelUp(true);
    } else {
      // No level up, redirect after short delay
      setTimeout(() => {
        router.push(`/child/${childId}`);
      }, 2000);
    }
  };

  const handleLevelUpClose = () => {
    setShowLevelUp(false);
    // Redirect after closing level-up modal
    setTimeout(() => {
      router.push(`/child/${childId}`);
    }, 500);
  };

  const handleQuizComplete = async (
    score: number,
    correctCount: number,
    _totalQuestions: number
  ) => {
    const baseXp = correctCount * 10;
    const perfectBonus = score === 100 ? 50 : 0;
    const totalXp = baseXp + perfectBonus;

    await handleActivityComplete('quiz', totalXp, { score });
  };

  const handleReadingComplete = async (xpEarned: number) => {
    await handleActivityComplete('reading', xpEarned);
  };

  const handleVideoComplete = async (xpEarned: number) => {
    await handleActivityComplete('video', xpEarned);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-h2">Loading module...</div>
      </div>
    );
  }

  if (!module || !child) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-h2">Module not found</div>
      </div>
    );
  }

  // Show activity if one is selected
  if (currentActivity === 'quiz' && quizQuestions.length > 0 && child) {
    return (
      <div className="min-h-screen py-8">
        <div className="container-app">
          <QuizActivity
            questions={quizQuestions}
            onComplete={handleQuizComplete}
            childName={child.name}
          />
        </div>
      </div>
    );
  }

  if (currentActivity === 'reading' && selectedReading && child) {
    return (
      <div className="min-h-screen py-8">
        <div className="container-app">
          <ReadingActivity
            article={selectedReading}
            onComplete={handleReadingComplete}
            childName={child.name}
          />
        </div>
      </div>
    );
  }

  if (currentActivity === 'video' && selectedVideo && child) {
    return (
      <div className="min-h-screen py-8">
        <div className="container-app">
          <VideoActivity
            video={selectedVideo}
            onComplete={handleVideoComplete}
            childName={child.name}
          />
        </div>
      </div>
    );
  }

  // Get module-specific content
  const planetFacts =
    moduleSlug === 'solar-system' ? getRandomPlanetFacts('Mercury', 3) : [];
  const astronauts = moduleSlug === 'astronauts' ? getRandomAstronauts(3) : [];

  return (
    <div className="min-h-screen py-8">
      <div className="container-app">
        <Link
          href={`/child/${childId}`}
          className="inline-flex items-center gap-2 text-white mb-6 hover:text-brand-mint"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Module Header */}
        <Card variant="glass-heavy" className="p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl">{module.icon}</div>
            <div>
              <h1 className="text-display text-white mb-2">{module.title}</h1>
              <p className="text-body-lg text-white/90">{module.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="info">Level {module.difficulty}</Badge>
            <Badge variant="default">
              Ages {module.min_age}-{module.max_age}
            </Badge>
            <Badge variant="default">{module.category}</Badge>
          </div>
        </Card>

        {/* Learning Content */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Fun Facts */}
          <Card variant="glass-medium" className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-accent-orange" />
              <h2 className="text-h3 text-white">Fun Facts!</h2>
            </div>
            {moduleSlug === 'solar-system' && planetFacts.length > 0 && (
              <div className="space-y-4">
                {planetFacts.map((fact) => (
                  <div key={fact.id} className="p-4 bg-white/10 rounded-lg">
                    <p className="text-body text-white/90">{fact.fact}</p>
                  </div>
                ))}
              </div>
            )}
            {moduleSlug === 'astronauts' && astronauts.length > 0 && (
              <div className="space-y-4">
                {astronauts.map((astronaut) => (
                  <div key={astronaut.id} className="p-4 bg-white/10 rounded-lg">
                    <h4 className="text-h4 text-white mb-2">{astronaut.name}</h4>
                    <p className="text-body-sm text-white/80 mb-2">
                      {astronaut.achievement} ({astronaut.year})
                    </p>
                    <p className="text-body-sm text-white/90">{astronaut.funFact}</p>
                  </div>
                ))}
              </div>
            )}
            {moduleSlug !== 'solar-system' && moduleSlug !== 'astronauts' && (
              <p className="text-body text-white/90">
                Discover amazing facts as you explore this module! More content coming soon! 🚀
              </p>
            )}
          </Card>

          {/* Did You Know? */}
          <Card variant="glass-medium" className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-6 h-6 text-space-yellow" />
              <h2 className="text-h3 text-white">Did You Know?</h2>
            </div>
            <div className="space-y-4">
              {moduleSlug === 'solar-system' && (
                <>
                  <div className="p-4 bg-accent-orange/20 rounded-lg border border-accent-orange/40">
                    <p className="text-body text-white">
                      🌍 Earth is the only planet in our solar system with liquid water on its
                      surface - that's why we have life here!
                    </p>
                  </div>
                  <div className="p-4 bg-space-purple/20 rounded-lg border border-space-purple/40">
                    <p className="text-body text-white">
                      🪐 Saturn's rings are so wide that you could fit 6 Earths side by side
                      across them!
                    </p>
                  </div>
                </>
              )}
              {moduleSlug === 'astronauts' && (
                <>
                  <div className="p-4 bg-accent-orange/20 rounded-lg border border-accent-orange/40">
                    <p className="text-body text-white">
                      👨‍🚀 Astronauts can grow up to 2 inches taller in space because their spine
                      stretches in zero gravity!
                    </p>
                  </div>
                  <div className="p-4 bg-space-purple/20 rounded-lg border border-space-purple/40">
                    <p className="text-body text-white">
                      🚀 The International Space Station travels at 17,500 mph - that's 5 miles
                      every second!
                    </p>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>

        {/* Activities */}
        <h2 className="text-h2 text-white mb-6">Activities</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Quiz Activity */}
          <Card hover className="p-6">
            <div className="text-5xl mb-4 text-center">
              <HelpCircle className="w-16 h-16 mx-auto text-accent-orange" />
            </div>
            <h3 className="text-h3 mb-2 text-center">Quiz Challenge</h3>
            <p className="text-body text-gray mb-4 text-center">
              Test your knowledge with fun questions!
            </p>
            <div className="text-center mb-4">
              <Badge variant="success">+10 XP per question</Badge>
            </div>
            <Button variant="primary" onClick={handleStartQuiz} className="w-full">
              Start Quiz
            </Button>
          </Card>

          {/* Reading Activity */}
          <Card hover className={availableReadings.length > 0 ? 'p-6' : 'p-6 opacity-60'}>
            <div className="text-5xl mb-4 text-center">
              <BookOpen className="w-16 h-16 mx-auto text-brand-mint" />
            </div>
            <h3 className="text-h3 mb-2 text-center">Reading</h3>
            <p className="text-body text-gray mb-4 text-center">
              {availableReadings.length > 0
                ? `${availableReadings.length} article${availableReadings.length > 1 ? 's' : ''} available`
                : 'Learn through articles and stories'}
            </p>
            <div className="text-center mb-4">
              <Badge variant="info">+20-30 XP</Badge>
            </div>
            {availableReadings.length > 0 ? (
              <Button
                variant="primary"
                onClick={() => handleStartReading(availableReadings[0])}
                className="w-full"
              >
                Start Reading
              </Button>
            ) : (
              <Button variant="ghost" disabled className="w-full">
                Coming Soon
              </Button>
            )}
          </Card>

          {/* Video Activity */}
          <Card hover className={availableVideos.length > 0 ? 'p-6' : 'p-6 opacity-60'}>
            <div className="text-5xl mb-4 text-center">
              <Video className="w-16 h-16 mx-auto text-support-sky-blue" />
            </div>
            <h3 className="text-h3 mb-2 text-center">Videos</h3>
            <p className="text-body text-gray mb-4 text-center">
              {availableVideos.length > 0
                ? `${availableVideos.length} video${availableVideos.length > 1 ? 's' : ''} available`
                : 'Watch and learn from space videos'}
            </p>
            <div className="text-center mb-4">
              <Badge variant="info">+15-25 XP</Badge>
            </div>
            {availableVideos.length > 0 ? (
              <Button
                variant="primary"
                onClick={() => handleStartVideo(availableVideos[0])}
                className="w-full"
              >
                Watch Video
              </Button>
            ) : (
              <Button variant="ghost" disabled className="w-full">
                Coming Soon
              </Button>
            )}
          </Card>
        </div>

        {/* Reading List (if available) */}
        {availableReadings.length > 1 && (
          <div className="mb-8">
            <h3 className="text-h3 text-white mb-4">All Reading Articles</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {availableReadings.map((article) => (
                <Card
                  key={article.id}
                  hover
                  className="p-4 cursor-pointer"
                  onClick={() => handleStartReading(article)}
                >
                  <div className="flex items-start gap-4">
                    <BookOpen className="w-8 h-8 text-brand-mint flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="text-h4 text-white mb-1">{article.title}</h4>
                      <p className="text-body-sm text-white/80 mb-2">{article.subtitle}</p>
                      <div className="flex gap-2">
                        <Badge variant="info">{article.estimatedMinutes} min</Badge>
                        <Badge variant="default">Level {article.readingLevel}</Badge>
                        <Badge variant="success">+{article.xpReward} XP</Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Video List (if available) */}
        {availableVideos.length > 1 && (
          <div className="mb-8">
            <h3 className="text-h3 text-white mb-4">All Videos</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {availableVideos.map((video) => (
                <Card
                  key={video.id}
                  hover
                  className="p-4 cursor-pointer"
                  onClick={() => handleStartVideo(video)}
                >
                  <div className="flex items-start gap-4">
                    <Video className="w-8 h-8 text-support-sky-blue flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="text-h4 text-white mb-1">{video.title}</h4>
                      <p className="text-body-sm text-white/80 mb-2">{video.description}</p>
                      <div className="flex gap-2">
                        <Badge variant="info">{video.durationMinutes} min</Badge>
                        <Badge variant="default">Level {video.ageLevel}</Badge>
                        <Badge variant="success">+{video.xpReward} XP</Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Level Up Modal */}
      {child && (
        <LevelUpModal
          isOpen={showLevelUp}
          onClose={handleLevelUpClose}
          oldXp={oldXp}
          newXp={newXp}
          childName={child.name}
        />
      )}
    </div>
  );
}
