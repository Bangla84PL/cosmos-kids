'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const supabase = createClient();

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        // Redirect to parent dashboard
        router.push('/parent/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-h1 mb-2">Welcome Back!</h1>
        <p className="text-body text-gray">Log in to your CosmosKids parent account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-semantic-error/10 border border-semantic-error text-semantic-error px-4 py-3 rounded-md text-body-sm">
            {error}
          </div>
        )}

        <Input
          type="email"
          label="Email Address"
          placeholder="parent@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between text-body-sm">
          <Link
            href="/forgot-password"
            className="text-brand-jungle hover:text-brand-mint"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
        >
          Log In
        </Button>
      </form>

      <div className="mt-6 text-center text-body-sm">
        <p className="text-gray">
          Don't have an account?{' '}
          <Link
            href="/signup"
            className="text-brand-jungle font-medium hover:text-brand-mint"
          >
            Sign up for free
          </Link>
        </p>
      </div>
    </Card>
  );
}
