'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      // Sign up user with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Create user record in cosmoskids_users table
        const { error: userError } = await supabase
          .from('cosmoskids_users')
          .insert({
            auth_id: authData.user.id,
            email: authData.user.email!,
            full_name: fullName,
          });

        if (userError) throw userError;

        // Redirect to parent dashboard
        router.push('/parent/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-h1 mb-2">Create Your Account</h1>
        <p className="text-body text-gray">
          Join CosmosKids and start your child's space adventure!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-semantic-error/10 border border-semantic-error text-semantic-error px-4 py-3 rounded-md text-body-sm">
            {error}
          </div>
        )}

        <Input
          type="text"
          label="Full Name"
          placeholder="John Smith"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          autoComplete="name"
        />

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
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          helpText="Must be at least 8 characters"
        />

        <Input
          type="password"
          label="Confirm Password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
        >
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center text-body-sm">
        <p className="text-gray">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-brand-jungle font-medium hover:text-brand-mint"
          >
            Log in
          </Link>
        </p>
      </div>

      <div className="mt-6 text-center text-caption text-gray">
        <p>
          By signing up, you agree to our{' '}
          <Link href="/terms" className="underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </Card>
  );
}
