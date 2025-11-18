'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Container from '@/components/layouts/Container';
import Footer from '@/components/layouts/Footer';
import { Home, Users, Settings, LogOut } from 'lucide-react';

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { dbUser, logout, isLoading } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/parent/dashboard', icon: Home },
    { name: 'My Children', href: '/parent/children', icon: Users },
    { name: 'Settings', href: '/parent/settings', icon: Settings },
  ];

  const isActive = (href: string) => pathname === href;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-h3">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-light-gray sticky top-0 z-50">
        <Container>
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/parent/dashboard" className="text-h4 font-bold text-brand-jungle">
                CosmosKids
              </Link>
              <div className="hidden md:flex gap-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                        isActive(item.href)
                          ? 'bg-brand-jungle text-white'
                          : 'text-dark-gray hover:bg-brand-sage'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-body-sm text-gray">
                {dbUser?.full_name || dbUser?.email}
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </Container>
      </nav>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <Container>{children}</Container>
      </main>

      <Footer />
    </div>
  );
}
