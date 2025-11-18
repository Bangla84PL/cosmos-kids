/**
 * Database types for CosmosKids
 * These types match the Supabase schema
 */

export interface User {
  id: string;
  auth_id: string;
  email: string;
  full_name: string | null;
  subscription_tier: 'free' | 'premium';
  created_at: string;
  updated_at: string;
}

export interface Child {
  id: string;
  user_id: string;
  name: string;
  age: number;
  avatar_url: string | null;
  level: number;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  last_active_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: number;
  min_age: number;
  max_age: number;
  image_url: string | null;
  icon: string | null;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  activity_type: 'quiz' | 'video' | 'reading' | 'game' | 'creative';
  content: ActivityContent;
  difficulty: number;
  xp_reward: number;
  order_index: number;
  estimated_duration: number | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ActivityContent {
  // Structure varies by activity_type
  [key: string]: unknown;
}

export interface QuizContent extends ActivityContent {
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number; // index of correct option
  explanation?: string;
}

export interface VideoContent extends ActivityContent {
  video_url: string;
  thumbnail_url?: string;
  duration?: number;
}

export interface ReadingContent extends ActivityContent {
  content: string; // Markdown or HTML
  images?: string[];
}

export interface Progress {
  id: string;
  child_id: string;
  activity_id: string;
  completed: boolean;
  score: number | null;
  time_spent: number | null;
  attempts: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Badge {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  badge_type: 'completion' | 'mastery' | 'streak' | 'special';
  criteria: BadgeCriteria;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export interface BadgeCriteria {
  [key: string]: unknown;
}

export interface Achievement {
  id: string;
  child_id: string;
  badge_id: string;
  earned_at: string;
}

export interface ChatMessage {
  id: string;
  child_id: string;
  message: string;
  response: string;
  session_id: string | null;
  created_at: string;
}

export interface Report {
  id: string;
  child_id: string;
  report_type: 'weekly' | 'monthly' | 'custom';
  period_start: string;
  period_end: string;
  report_url: string | null;
  data: ReportData | null;
  generated_at: string;
}

export interface ReportData {
  [key: string]: unknown;
}

// Supabase response types
export type SupabaseResponse<T> = {
  data: T | null;
  error: Error | null;
};

// API types
export interface AuthUser {
  id: string;
  email: string;
  user: User | null;
}
