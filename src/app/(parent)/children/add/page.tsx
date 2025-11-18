'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddChildPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const ageNum = parseInt(age);
    if (ageNum < 6 || ageNum > 12) {
      setError('Age must be between 6 and 12');
      return;
    }

    setIsLoading(true);

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Not authenticated');
      }

      // Get user's cosmoskids_users record
      const { data: dbUser } = await supabase
        .from('cosmoskids_users')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (!dbUser) {
        throw new Error('User record not found');
      }

      // Create child profile
      const { data: child, error: insertError } = await supabase
        .from('cosmoskids_children')
        .insert({
          user_id: dbUser.id,
          name,
          age: ageNum,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Redirect to child's learning interface
      if (child) {
        router.push(`/child/${child.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create child profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Link href="/parent/dashboard" className="inline-flex items-center gap-2 text-white mb-6 hover:text-brand-mint">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <Card className="p-8">
        <h1 className="text-h1 mb-2">Add a Child</h1>
        <p className="text-body text-gray mb-8">
          Create a profile for your child to start their cosmic learning adventure!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-semantic-error/10 border border-semantic-error text-semantic-error px-4 py-3 rounded-md text-body-sm">
              {error}
            </div>
          )}

          <Input
            label="Child's Name"
            placeholder="Enter your child's name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            type="number"
            label="Age"
            placeholder="6-12"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            min="6"
            max="12"
            helpText="Children must be between 6 and 12 years old"
          />

          <div className="flex gap-4">
            <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1">
              Create Profile
            </Button>
            <Link href="/parent/dashboard" className="flex-1">
              <Button type="button" variant="ghost" className="w-full">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
