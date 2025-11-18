'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Child } from '@/lib/types/database';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Plus, TrendingUp, Award, Clock } from 'lucide-react';

// Force dynamic rendering to prevent build-time errors with Supabase client
export const dynamic = 'force-dynamic';

export default function ParentDashboard() {
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchChildren() {
      const { data } = await supabase
        .from('cosmoskids_children')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setChildren(data);
      setIsLoading(false);
    }

    fetchChildren();
  }, [supabase]);

  if (isLoading) {
    return <div className="text-white text-h3">Loading...</div>;
  }

  if (children.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 animate-fade-in">
        <Card variant="glass-medium" className="p-12">
          <div className="text-6xl mb-6">🚀</div>
          <h1 className="text-h1 text-white mb-4">Welcome to CosmosKids!</h1>
          <p className="text-body-lg text-white/90 mb-8">
            Let's create your first child profile to start their cosmic learning adventure!
          </p>
          <Link href="/parent/children/add">
            <Button variant="accent" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Child
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-h1 text-white">Dashboard</h1>
        <Link href="/parent/children/add">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Child
          </Button>
        </Link>
      </div>

      {/* Children Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {children.map((child) => (
          <Link key={child.id} href={`/child/${child.id}`}>
            <Card hover className="h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-brand-mint text-white text-2xl flex items-center justify-center font-bold">
                    {child.name[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-h4 mb-1">{child.name}</h3>
                    <p className="text-body-sm text-gray">{child.age} years old</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-body-sm text-gray flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    Level
                  </span>
                  <Badge variant="info">Level {child.level}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-body-sm text-gray flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    Total XP
                  </span>
                  <span className="text-body font-medium">{child.total_xp.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-body-sm text-gray flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Streak
                  </span>
                  <Badge variant="warning">{child.current_streak} days</Badge>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-light-gray">
                <p className="text-body-sm text-gray">
                  Last active:{' '}
                  {child.last_active_at
                    ? new Date(child.last_active_at).toLocaleDateString()
                    : 'Never'}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card variant="glass-medium">
          <h3 className="text-h4 text-white mb-2">Total Children</h3>
          <p className="text-display text-white">{children.length}</p>
        </Card>
        <Card variant="glass-medium">
          <h3 className="text-h4 text-white mb-2">Total XP Earned</h3>
          <p className="text-display text-white">
            {children.reduce((sum, child) => sum + child.total_xp, 0).toLocaleString()}
          </p>
        </Card>
        <Card variant="glass-medium">
          <h3 className="text-h4 text-white mb-2">Average Level</h3>
          <p className="text-display text-white">
            {children.length > 0
              ? Math.round(children.reduce((sum, child) => sum + child.level, 0) / children.length)
              : 0}
          </p>
        </Card>
      </div>
    </div>
  );
}
