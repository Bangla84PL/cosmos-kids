import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="container-app py-20">
        <div className="glass-card-medium max-w-4xl mx-auto p-12 text-center animate-fade-in">
          <h1 className="text-display text-white mb-6">
            🚀 Welcome to CosmosKids
          </h1>
          <p className="text-body-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Embark on an exciting journey through space! Learn about planets, stars, astronauts,
            and the wonders of the universe with your AI space guide, Stella.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn-primary">
              Get Started Free
            </Link>
            <Link href="/login" className="btn-secondary bg-white/20 border-white text-white hover:bg-white hover:text-brand-jungle">
              Parent Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container-app py-16">
        <h2 className="text-h1 text-white text-center mb-12">
          Why CosmosKids?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-h3 mb-3">Interactive Learning</h3>
            <p className="text-body text-gray">
              Explore planets, complete missions, and discover the cosmos through fun activities
              and games.
            </p>
          </div>
          <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-h3 mb-3">AI Space Tutor</h3>
            <p className="text-body text-gray">
              Meet Stella, your friendly AI companion who answers questions and guides your cosmic
              adventure.
            </p>
          </div>
          <div className="card animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-h3 mb-3">Achievements & Rewards</h3>
            <p className="text-body text-gray">
              Earn badges, level up, and unlock special content as you progress through your
              learning journey.
            </p>
          </div>
        </div>
      </section>

      {/* For Parents Section */}
      <section className="container-app py-16">
        <div className="glass-card-heavy max-w-3xl mx-auto p-10">
          <h2 className="text-h1 text-white mb-6">For Parents</h2>
          <ul className="space-y-4 text-white/90">
            <li className="flex items-start gap-3">
              <span className="text-accent-orange text-xl">✓</span>
              <span>Track your child's progress and learning achievements</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent-orange text-xl">✓</span>
              <span>Receive weekly progress reports and insights</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent-orange text-xl">✓</span>
              <span>Manage multiple children from one account</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent-orange text-xl">✓</span>
              <span>Safe, age-appropriate content for children 6-12</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent-orange text-xl">✓</span>
              <span>No ads, no distractions, just quality learning</span>
            </li>
          </ul>
          <div className="mt-8 text-center">
            <Link href="/signup" className="btn-accent">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Learning Topics Section */}
      <section className="container-app py-16">
        <h2 className="text-h1 text-white text-center mb-12">
          What You'll Learn
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { emoji: '🪐', title: 'Solar System', desc: 'Explore all 8 planets and learn fascinating facts' },
            { emoji: '⭐', title: 'Stars & Constellations', desc: 'Discover constellations and how stars are born' },
            { emoji: '🚀', title: 'Space Missions', desc: 'Learn about famous missions and astronauts' },
            { emoji: '🛸', title: 'Rockets & Technology', desc: 'Understand how rockets work and spacecraft design' },
            { emoji: '👨‍🚀', title: 'Life in Space', desc: 'Experience daily life aboard the International Space Station' },
            { emoji: '🌌', title: 'Astrobiology', desc: 'Explore the search for life beyond Earth' },
          ].map((topic, index) => (
            <div
              key={topic.title}
              className="card text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-5xl mb-3">{topic.emoji}</div>
              <h4 className="text-h4 mb-2">{topic.title}</h4>
              <p className="text-body-sm text-gray">{topic.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-app py-20">
        <div className="glass-card-medium max-w-2xl mx-auto p-12 text-center">
          <h2 className="text-h1 text-white mb-4">
            Ready to Explore the Universe?
          </h2>
          <p className="text-body-lg text-white/90 mb-8">
            Join thousands of young space explorers on an educational adventure!
          </p>
          <Link href="/signup" className="btn-accent text-lg px-8 py-4">
            Start Your Journey Today
          </Link>
        </div>
      </section>
    </main>
  );
}
