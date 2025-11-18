-- CosmosKids Database Schema
-- Namespace: cosmoskids_
-- Target: Shared Supabase instance at api.supabase.smartcamp.ai

-- ============================================================================
-- Extensions
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Tables
-- ============================================================================

-- Users table (parent/guardian accounts)
CREATE TABLE IF NOT EXISTS cosmoskids_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cosmoskids_users_auth_id ON cosmoskids_users(auth_id);
CREATE INDEX IF NOT EXISTS idx_cosmoskids_users_email ON cosmoskids_users(email);

COMMENT ON TABLE cosmoskids_users IS 'Parent/guardian accounts linked to Supabase Auth';

-- Children profiles
CREATE TABLE IF NOT EXISTS cosmoskids_children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES cosmoskids_users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 6 AND age <= 12),
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cosmoskids_children_user_id ON cosmoskids_children(user_id);
CREATE INDEX IF NOT EXISTS idx_cosmoskids_children_level ON cosmoskids_children(level);

COMMENT ON TABLE cosmoskids_children IS 'Child profiles managed by parents';

-- Learning modules
CREATE TABLE IF NOT EXISTS cosmoskids_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  difficulty INTEGER DEFAULT 1 CHECK (difficulty >= 1 AND difficulty <= 5),
  min_age INTEGER DEFAULT 6,
  max_age INTEGER DEFAULT 12,
  image_url TEXT,
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cosmoskids_modules_category ON cosmoskids_modules(category);
CREATE INDEX IF NOT EXISTS idx_cosmoskids_modules_published ON cosmoskids_modules(is_published);
CREATE UNIQUE INDEX IF NOT EXISTS idx_cosmoskids_modules_slug ON cosmoskids_modules(slug);

COMMENT ON TABLE cosmoskids_modules IS 'Learning modules (e.g., Solar System, Rockets)';

-- Activities within modules
CREATE TABLE IF NOT EXISTS cosmoskids_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES cosmoskids_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('quiz', 'video', 'reading', 'game', 'creative')),
  content JSONB NOT NULL,
  difficulty INTEGER DEFAULT 1,
  xp_reward INTEGER DEFAULT 10,
  order_index INTEGER DEFAULT 0,
  estimated_duration INTEGER,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cosmoskids_activities_module_id ON cosmoskids_activities(module_id);
CREATE INDEX IF NOT EXISTS idx_cosmoskids_activities_type ON cosmoskids_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_cosmoskids_activities_published ON cosmoskids_activities(is_published);

COMMENT ON TABLE cosmoskids_activities IS 'Individual activities within learning modules';

-- Child progress tracking
CREATE TABLE IF NOT EXISTS cosmoskids_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES cosmoskids_children(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES cosmoskids_activities(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  time_spent INTEGER,
  attempts INTEGER DEFAULT 1,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id, activity_id)
);

CREATE INDEX IF NOT EXISTS idx_cosmoskids_progress_child_id ON cosmoskids_progress(child_id);
CREATE INDEX IF NOT EXISTS idx_cosmoskids_progress_activity_id ON cosmoskids_progress(activity_id);
CREATE INDEX IF NOT EXISTS idx_cosmoskids_progress_completed ON cosmoskids_progress(completed);

COMMENT ON TABLE cosmoskids_progress IS 'Tracks child completion of activities';

-- Badge definitions
CREATE TABLE IF NOT EXISTS cosmoskids_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  badge_type TEXT NOT NULL CHECK (badge_type IN ('completion', 'mastery', 'streak', 'special')),
  criteria JSONB NOT NULL,
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cosmoskids_badges_type ON cosmoskids_badges(badge_type);
CREATE INDEX IF NOT EXISTS idx_cosmoskids_badges_active ON cosmoskids_badges(is_active);
CREATE UNIQUE INDEX IF NOT EXISTS idx_cosmoskids_badges_slug ON cosmoskids_badges(slug);

COMMENT ON TABLE cosmoskids_badges IS 'Achievement/badge definitions';

-- Earned achievements
CREATE TABLE IF NOT EXISTS cosmoskids_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES cosmoskids_children(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES cosmoskids_badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_cosmoskids_achievements_child_id ON cosmoskids_achievements(child_id);
CREATE INDEX IF NOT EXISTS idx_cosmoskids_achievements_badge_id ON cosmoskids_achievements(badge_id);
CREATE INDEX IF NOT EXISTS idx_cosmoskids_achievements_earned_at ON cosmoskids_achievements(earned_at);

COMMENT ON TABLE cosmoskids_achievements IS 'Tracks which children earned which badges';

-- Chat history
CREATE TABLE IF NOT EXISTS cosmoskids_chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES cosmoskids_children(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cosmoskids_chat_child_id ON cosmoskids_chat_history(child_id);
CREATE INDEX IF NOT EXISTS idx_cosmoskids_chat_session_id ON cosmoskids_chat_history(session_id);
CREATE INDEX IF NOT EXISTS idx_cosmoskids_chat_created_at ON cosmoskids_chat_history(created_at);

COMMENT ON TABLE cosmoskids_chat_history IS 'AI chat conversation logs';

-- Generated reports
CREATE TABLE IF NOT EXISTS cosmoskids_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES cosmoskids_children(id) ON DELETE CASCADE,
  report_type TEXT DEFAULT 'monthly' CHECK (report_type IN ('weekly', 'monthly', 'custom')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  report_url TEXT,
  data JSONB,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cosmoskids_reports_child_id ON cosmoskids_reports(child_id);
CREATE INDEX IF NOT EXISTS idx_cosmoskids_reports_period ON cosmoskids_reports(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_cosmoskids_reports_generated_at ON cosmoskids_reports(generated_at);

COMMENT ON TABLE cosmoskids_reports IS 'Generated progress reports (PDFs)';

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE cosmoskids_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cosmoskids_children ENABLE ROW LEVEL SECURITY;
ALTER TABLE cosmoskids_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE cosmoskids_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE cosmoskids_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE cosmoskids_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE cosmoskids_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE cosmoskids_chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE cosmoskids_reports ENABLE ROW LEVEL SECURITY;

-- cosmoskids_users policies
CREATE POLICY "Users can view own profile"
  ON cosmoskids_users FOR SELECT
  USING (auth.uid() = auth_id);

CREATE POLICY "Users can update own profile"
  ON cosmoskids_users FOR UPDATE
  USING (auth.uid() = auth_id);

-- cosmoskids_children policies
CREATE POLICY "Parents can view own children"
  ON cosmoskids_children FOR SELECT
  USING (user_id IN (SELECT id FROM cosmoskids_users WHERE auth_id = auth.uid()));

CREATE POLICY "Parents can insert own children"
  ON cosmoskids_children FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM cosmoskids_users WHERE auth_id = auth.uid()));

CREATE POLICY "Parents can update own children"
  ON cosmoskids_children FOR UPDATE
  USING (user_id IN (SELECT id FROM cosmoskids_users WHERE auth_id = auth.uid()));

CREATE POLICY "Parents can delete own children"
  ON cosmoskids_children FOR DELETE
  USING (user_id IN (SELECT id FROM cosmoskids_users WHERE auth_id = auth.uid()));

-- cosmoskids_modules policies (public read for published modules)
CREATE POLICY "Anyone can view published modules"
  ON cosmoskids_modules FOR SELECT
  USING (is_published = true);

-- cosmoskids_activities policies (public read for published activities)
CREATE POLICY "Anyone can view published activities"
  ON cosmoskids_activities FOR SELECT
  USING (is_published = true);

-- cosmoskids_progress policies
CREATE POLICY "Parents can view own children's progress"
  ON cosmoskids_progress FOR SELECT
  USING (child_id IN (
    SELECT id FROM cosmoskids_children
    WHERE user_id IN (SELECT id FROM cosmoskids_users WHERE auth_id = auth.uid())
  ));

CREATE POLICY "Progress can be inserted for own children"
  ON cosmoskids_progress FOR INSERT
  WITH CHECK (child_id IN (
    SELECT id FROM cosmoskids_children
    WHERE user_id IN (SELECT id FROM cosmoskids_users WHERE auth_id = auth.uid())
  ));

CREATE POLICY "Progress can be updated for own children"
  ON cosmoskids_progress FOR UPDATE
  USING (child_id IN (
    SELECT id FROM cosmoskids_children
    WHERE user_id IN (SELECT id FROM cosmoskids_users WHERE auth_id = auth.uid())
  ));

-- cosmoskids_badges policies (public read for active badges)
CREATE POLICY "Anyone can view active badges"
  ON cosmoskids_badges FOR SELECT
  USING (is_active = true);

-- cosmoskids_achievements policies
CREATE POLICY "Parents can view own children's achievements"
  ON cosmoskids_achievements FOR SELECT
  USING (child_id IN (
    SELECT id FROM cosmoskids_children
    WHERE user_id IN (SELECT id FROM cosmoskids_users WHERE auth_id = auth.uid())
  ));

CREATE POLICY "Achievements can be inserted for own children"
  ON cosmoskids_achievements FOR INSERT
  WITH CHECK (child_id IN (
    SELECT id FROM cosmoskids_children
    WHERE user_id IN (SELECT id FROM cosmoskids_users WHERE auth_id = auth.uid())
  ));

-- cosmoskids_chat_history policies
CREATE POLICY "Parents can view own children's chat history"
  ON cosmoskids_chat_history FOR SELECT
  USING (child_id IN (
    SELECT id FROM cosmoskids_children
    WHERE user_id IN (SELECT id FROM cosmoskids_users WHERE auth_id = auth.uid())
  ));

CREATE POLICY "Chat history can be inserted for own children"
  ON cosmoskids_chat_history FOR INSERT
  WITH CHECK (child_id IN (
    SELECT id FROM cosmoskids_children
    WHERE user_id IN (SELECT id FROM cosmoskids_users WHERE auth_id = auth.uid())
  ));

-- cosmoskids_reports policies
CREATE POLICY "Parents can view own children's reports"
  ON cosmoskids_reports FOR SELECT
  USING (child_id IN (
    SELECT id FROM cosmoskids_children
    WHERE user_id IN (SELECT id FROM cosmoskids_users WHERE auth_id = auth.uid())
  ));

-- ============================================================================
-- Functions
-- ============================================================================

-- Calculate level from XP
CREATE OR REPLACE FUNCTION cosmoskids_calculate_level(xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Formula: level = floor(sqrt(xp / 100)) + 1
  -- Level 1: 0-99 XP
  -- Level 2: 100-399 XP
  -- Level 3: 400-899 XP
  -- Level 4: 900-1599 XP
  -- etc.
  RETURN GREATEST(1, FLOOR(SQRT(xp / 100.0)) + 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- Triggers
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION cosmoskids_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cosmoskids_users_updated_at
  BEFORE UPDATE ON cosmoskids_users
  FOR EACH ROW
  EXECUTE FUNCTION cosmoskids_update_timestamp();

CREATE TRIGGER cosmoskids_children_updated_at
  BEFORE UPDATE ON cosmoskids_children
  FOR EACH ROW
  EXECUTE FUNCTION cosmoskids_update_timestamp();

CREATE TRIGGER cosmoskids_modules_updated_at
  BEFORE UPDATE ON cosmoskids_modules
  FOR EACH ROW
  EXECUTE FUNCTION cosmoskids_update_timestamp();

CREATE TRIGGER cosmoskids_activities_updated_at
  BEFORE UPDATE ON cosmoskids_activities
  FOR EACH ROW
  EXECUTE FUNCTION cosmoskids_update_timestamp();

CREATE TRIGGER cosmoskids_progress_updated_at
  BEFORE UPDATE ON cosmoskids_progress
  FOR EACH ROW
  EXECUTE FUNCTION cosmoskids_update_timestamp();

-- Auto-update child level when XP changes
CREATE OR REPLACE FUNCTION cosmoskids_update_child_level()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.total_xp != OLD.total_xp THEN
    NEW.level := cosmoskids_calculate_level(NEW.total_xp);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cosmoskids_children_update_level
  BEFORE UPDATE OF total_xp ON cosmoskids_children
  FOR EACH ROW
  EXECUTE FUNCTION cosmoskids_update_child_level();

-- ============================================================================
-- Seed Data (Initial Modules and Badges)
-- ============================================================================

-- Insert initial learning modules
INSERT INTO cosmoskids_modules (slug, title, description, category, difficulty, image_url, icon, order_index, is_published) VALUES
  ('solar-system', 'Solar System Explorer', 'Discover the planets, moons, and wonders of our solar system', 'planets', 1, '/content/solar-system.png', '🪐', 1, true),
  ('stars-constellations', 'Stars & Constellations', 'Learn about stars, constellations, and the night sky', 'stars', 2, '/content/stars.png', '⭐', 2, true),
  ('space-missions', 'Space Missions & History', 'Explore famous missions and the history of space exploration', 'missions', 2, '/content/missions.png', '🚀', 3, true),
  ('rockets-technology', 'Rockets & Technology', 'Understand how rockets work and spacecraft design', 'technology', 3, '/content/rockets.png', '🛸', 4, true),
  ('astronauts', 'Life as an Astronaut', 'Experience daily life in space and on the ISS', 'astronauts', 2, '/content/astronauts.png', '👨‍🚀', 5, true),
  ('astrobiology', 'Astrobiology & Aliens', 'The search for life beyond Earth', 'science', 4, '/content/astrobiology.png', '🌌', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert initial badges
INSERT INTO cosmoskids_badges (slug, name, description, image_url, badge_type, criteria, tier, order_index, is_active) VALUES
  ('first-steps', 'First Steps', 'Completed your first activity!', '/badges/first-steps.png', 'special', '{"activities_completed": 1}', 'bronze', 1, true),
  ('solar-system-explorer', 'Solar System Explorer', 'Completed all Solar System activities', '/badges/solar-system.png', 'completion', '{"module": "solar-system", "completion": 100}', 'gold', 2, true),
  ('perfect-score', 'Perfect Score', 'Achieved 100% on any quiz', '/badges/perfect.png', 'mastery', '{"score": 100}', 'silver', 3, true),
  ('week-streak', '7-Day Streak', 'Logged in for 7 days in a row', '/badges/streak-7.png', 'streak', '{"streak": 7}', 'silver', 4, true),
  ('month-streak', '30-Day Streak', 'Logged in for 30 days in a row', '/badges/streak-30.png', 'streak', '{"streak": 30}', 'gold', 5, true),
  ('level-10', 'Rising Star', 'Reached Level 10', '/badges/level-10.png', 'special', '{"level": 10}', 'silver', 6, true),
  ('all-modules', 'Cosmic Scholar', 'Completed all learning modules', '/badges/scholar.png', 'completion', '{"all_modules": true}', 'platinum', 7, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- Storage Buckets (Execute via Supabase Dashboard or API)
-- ============================================================================

-- Note: Storage buckets must be created via Supabase Dashboard or API
-- Bucket names:
--   - cosmoskids-avatars (public)
--   - cosmoskids-reports (private)
--   - cosmoskids-content (public)

-- Example storage policies (to be created in Supabase Dashboard):

-- cosmoskids-avatars policies:
-- CREATE POLICY "Avatar files are publicly accessible"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'cosmoskids-avatars');
--
-- CREATE POLICY "Users can upload avatars"
--   ON storage.objects FOR INSERT
--   WITH CHECK (
--     bucket_id = 'cosmoskids-avatars' AND
--     auth.role() = 'authenticated'
--   );

-- cosmoskids-reports policies:
-- CREATE POLICY "Parents can view own children's reports"
--   ON storage.objects FOR SELECT
--   USING (
--     bucket_id = 'cosmoskids-reports' AND
--     (storage.foldername(name))[1] IN (
--       SELECT id::text FROM cosmoskids_children
--       WHERE user_id IN (SELECT id FROM cosmoskids_users WHERE auth_id = auth.uid())
--     )
--   );

-- cosmoskids-content policies:
-- CREATE POLICY "Content files are publicly accessible"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'cosmoskids-content');
