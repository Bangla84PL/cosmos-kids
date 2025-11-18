'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { User as DBUser } from '@/lib/types/database';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (user) {
        // Fetch user from cosmoskids_users table
        const { data: dbUserData } = await supabase
          .from('cosmoskids_users')
          .select('*')
          .eq('auth_id', user.id)
          .single();

        setDbUser(dbUserData);
      }

      setIsLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: dbUserData } = await supabase
          .from('cosmoskids_users')
          .select('*')
          .eq('auth_id', session.user.id)
          .single();

        setDbUser(dbUserData);
      } else {
        setDbUser(null);
      }

      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  return {
    user,
    dbUser,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}
