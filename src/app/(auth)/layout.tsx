import Footer from '@/components/layouts/Footer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}
