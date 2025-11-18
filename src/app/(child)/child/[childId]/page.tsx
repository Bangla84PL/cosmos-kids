'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Child, Module } from '@/lib/types/database';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Award, TrendingUp, Star, Rocket } from 'lucide-react';
import Link from 'next/link';

// Force dynamic rendering to prevent build-time errors with Supabase client
export const dynamic = 'force-dynamic';

export default function ChildDashboard() {
  const params = useParams();
  const childId = params.childId as string;
  const [child, setChild] = useState<Child | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      // Fetch child data
      const { data: childData } = await supabase
        .from('cosmoskids_children')
        .select('*')
        .eq('id', childId)
        .single();

      // Fetch modules
      const { data: modulesData } = await supabase
        .from('cosmoskids_modules')
        .select('*')
        .eq('is_published', true)
        .order('order_index');

      if (childData) setChild(childData);
      if (modulesData) setModules(modulesData);
      setIsLoading(false);

      // Update last_active_at
      if (childData) {
        await supabase
          .from('cosmoskids_children')
          .update({ last_active_at: new Date().toISOString() })
          .eq('id', childId);
      }
    }

    fetchData();
  }, [supabase, childId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-h2">Loading Mission Control...</div>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-h2">Child not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="space-gradient py-8 mb-8">
        <div className="container-app">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-display text-white mb-2">
                Welcome back, {child.name}! 👋
              </h1>
              <p className="text-body-lg text-white/90">Ready to explore the cosmos?</p>
            </div>
            <Link href="/parent/dashboard">
              <Button variant="ghost" className="bg-white/20 text-white hover:bg-white/30">
                Parent Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container-app">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card variant="glass-medium" className="text-center">
            <div className="flex flex-col items-center gap-2">
              <TrendingUp className="w-8 h-8 text-accent-orange" />
              <div className="text-h2 text-white">{child.level}</div>
              <div className="text-body-sm text-white/80">Level</div>
            </div>
          </Card>
          <Card variant="glass-medium" className="text-center">
            <div className="flex flex-col items-center gap-2">
              <Star className="w-8 h-8 text-space-yellow" />
              <div className="text-h2 text-white">{child.total_xp.toLocaleString()}</div>
              <div className="text-body-sm text-white/80">Total XP</div>
            </div>
          </Card>
          <Card variant="glass-medium" className="text-center">
            <div className="flex flex-col items-center gap-2">
              <Award className="w-8 h-8 text-brand-mint" />
              <div className="text-h2 text-white">0</div>
              <div className="text-body-sm text-white/80">Badges</div>
            </div>
          </Card>
          <Card variant="glass-medium" className="text-center">
            <div className="flex flex-col items-center gap-2">
              <Rocket className="w-8 h-8 text-accent-coral" />
              <div className="text-h2 text-white">{child.current_streak}</div>
              <div className="text-body-sm text-white/80">Day Streak</div>
            </div>
          </Card>
        </div>

        {/* Learning Modules */}
        <div className="mb-8">
          <h2 className="text-h1 text-white mb-6">🌌 Galaxy Map - Choose Your Adventure</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <Card key={module.id} hover className="relative overflow-hidden">
                <div className="text-4xl mb-3">{module.icon}</div>
                <h3 className="text-h3 mb-2">{module.title}</h3>
                <p className="text-body text-gray mb-4">{module.description}</p>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="info">Level {module.difficulty}</Badge>
                  <Badge variant="default">
                    Ages {module.min_age}-{module.max_age}
                  </Badge>
                </div>
                <Button variant="primary" className="w-full" disabled>
                  Coming Soon!
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Encouragement Message */}
        <Card variant="glass-heavy" className="text-center p-12">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-h2 text-white mb-3">Your Cosmic Journey Awaits!</h2>
          <p className="text-body-lg text-white/90 max-w-2xl mx-auto">
            We're building amazing space adventures just for you! Soon you'll be able to explore
            planets, learn about astronauts, chat with Stella (your AI space guide), and earn
            awesome badges. Stay tuned, Space Explorer!
          </p>
        </Card>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm py-3 text-center text-body-sm text-gray border-t border-light-gray">
        <p>
          © Created with ❤️ by{' '}
          <a
            href="https://smartcamp.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-jungle hover:text-brand-mint no-underline hover:underline"
          >
            SmartCamp.AI
          </a>
        </p>
      </footer>
    </div>
  );
}
