import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Smartphone,
  Zap,
  ShieldCheck,
  Code2,
  ArrowRight,
  Check,
  Infinity as InfinityIcon,
  Headphones,
} from 'lucide-react';
import Logo from '../assets/Logo.png';

export function Home() {
  const features = [
    {
      icon: MessageSquare,
      title: 'Unlimited Messages',
      desc: 'Send and receive unlimited WhatsApp messages. No caps, no hidden fees, no overage charges.',
    },
    {
      icon: Smartphone,
      title: 'Multi-Session Support',
      desc: 'Connect and manage multiple WhatsApp accounts from a single dashboard with ease.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast API',
      desc: 'High-performance HTTP API built for speed and reliability at scale.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure & Reliable',
      desc: 'Encrypted sessions, stable connections, and 99.9% uptime guaranteed.',
    },
    {
      icon: Code2,
      title: 'Developer Friendly',
      desc: 'Clean REST endpoints with full documentation. Integrate in minutes, not days.',
    },
    {
      icon: Headphones,
      title: 'Priority Support',
      desc: 'Get help when you need it with dedicated priority support for subscribers.',
    },
  ];

  const planFeatures = [
    'Unlimited WhatsApp messages',
    'Multiple sessions',
    'Full HTTP API access',
    'Real-time webhooks',
    'Chat history & media support',
    'Priority support',
    '99.9% uptime guarantee',
    'No setup or hidden fees',
  ];

  return (
    <div className="min-h-screen bg-app-bg">
      {/* Nav */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-app-surface/80 border-b border-app-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-lg shadow-[#25D366]/20">
              <img src={Logo} alt="RelayX Logo" className="w-7 h-7" />
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-app-text-secondary">
            <a href="#features" className="hover:text-app-text transition-colors">Features</a>
            <a href="#pricing" className="hover:text-app-text transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-app-text transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-sm text-app-text-secondary hover:text-app-text transition-colors hidden sm:inline"
            >
              Sign in
            </Link>
            <Link
              to="/dashboard"
              className="text-sm font-medium px-4 py-2 rounded-lg bg-[#25D366] text-white hover:bg-[#1fb855] transition-colors shadow-lg shadow-[#25D366]/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#25D366]/[0.06] to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-20 md:py-28 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
            WhatsApp HTTP API Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-app-text tracking-tight leading-tight">
            Send <span className="text-[#25D366]">unlimited</span> WhatsApp
            <br className="hidden md:block" /> messages via a simple API
          </h1>
          <p className="mt-6 text-lg md:text-xl text-app-text-secondary max-w-2xl mx-auto">
            RelayX is a powerful HTTP API for WhatsApp. Automate messaging, build bots,
            and scale your communication — all for one flat monthly price.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#25D366] text-white font-semibold hover:bg-[#1fb855] transition-colors shadow-lg shadow-[#25D366]/30"
            >
              Start Sending Messages
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-app-surface border border-app-border text-app-text font-semibold hover:border-app-border-hover transition-colors"
            >
              View Pricing
            </a>
          </div>
          <p className="mt-4 text-xs text-app-text-muted">No credit card required to explore · Cancel anytime</p>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-y border-app-border bg-app-surface/50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '∞', label: 'Messages included' },
            { value: '99.9%', label: 'Uptime guarantee' },
            { value: '< 1s', label: 'API response time' },
            { value: '24/7', label: 'Priority support' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-3xl md:text-4xl font-extrabold text-app-text">{stat.value}</p>
              <p className="mt-1 text-sm text-app-text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-4 md:px-6 py-20 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-app-text">Everything you need to scale</h2>
          <p className="mt-4 text-app-text-secondary">
            A complete toolkit for building WhatsApp automation into your product or workflow.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-app-surface rounded-xl p-6 border border-app-border hover:border-[#25D366]/40 transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-lg bg-[#25D366]/10 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-[#25D366]" />
              </div>
              <h3 className="text-app-text font-semibold text-lg">{title}</h3>
              <p className="mt-2 text-sm text-app-text-secondary leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 md:px-6 py-20 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-app-text">Simple, transparent pricing</h2>
          <p className="mt-4 text-app-text-secondary">
            One plan. Everything included. No surprises on your bill.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Monthly plan */}
          <div className="relative bg-app-surface rounded-2xl border border-app-border shadow-lg overflow-hidden flex flex-col">
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex items-center gap-2 text-app-text-secondary text-sm">
                <InfinityIcon className="w-4 h-4 text-[#25D366]" />
                Unlimited Plan
              </div>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-5xl font-extrabold text-app-text">₹1200</span>
                <span className="text-app-text-muted mb-1.5">/ month</span>
              </div>
              <p className="mt-2 text-sm text-app-text-secondary">
                Unlimited messages, full API access, and priority support.
              </p>

              <Link
                to="/dashboard"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-app-surface border border-app-border text-app-text font-semibold hover:border-app-border-hover transition-colors"
              >
                Subscribe Monthly
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="mt-8 space-y-3">
                {planFeatures.map(feature => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-[#25D366]/15 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#25D366]" />
                    </div>
                    <span className="text-sm text-app-text">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Yearly plan */}
          <div className="relative bg-app-surface rounded-2xl border-2 border-[#25D366] shadow-xl shadow-[#25D366]/10 overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#25D366] text-white text-xs font-semibold rounded-bl-lg">
              SAVE ₹2400
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex items-center gap-2 text-app-text-secondary text-sm">
                <InfinityIcon className="w-4 h-4 text-[#25D366]" />
                Unlimited Plan · Yearly
              </div>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-5xl font-extrabold text-app-text">₹12000</span>
                <span className="text-app-text-muted mb-1.5">/ year</span>
              </div>
              <p className="mt-2 text-sm text-app-text-secondary">
                Pay once a year and save ₹2400 — equivalent of 2 months free.
              </p>

              <Link
                to="/dashboard"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#25D366] text-white font-semibold hover:bg-[#1fb855] transition-colors shadow-lg shadow-[#25D366]/30"
              >
                Subscribe Yearly
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="mt-8 space-y-3">
                {planFeatures.map(feature => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-[#25D366]/15 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#25D366]" />
                    </div>
                    <span className="text-sm text-app-text">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-app-text-muted">
          Prices in INR. Cancel anytime — no long-term contracts.
        </p>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
        <div className="rounded-2xl bg-gradient-to-br from-[#25D366] to-[#128C7E] p-10 md:p-14 text-center shadow-2xl shadow-[#25D366]/20">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to start sending?</h2>
          <p className="mt-3 text-white/90 max-w-xl mx-auto">
            Get unlimited WhatsApp messages, full API access, and priority support — all for ₹1200/month.
          </p>
          <Link
            to="/dashboard"
            className="mt-7 inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-white text-[#128C7E] font-semibold hover:bg-white/90 transition-colors"
          >
            Get Started for ₹1200/month
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-4 md:px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-app-text text-center mb-12">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: 'What does "unlimited messages" mean?',
              a: 'There is no cap on the number of WhatsApp messages you can send or receive through the API within your billing month. Fair-use terms apply to prevent abuse.',
            },
            {
              q: 'How much does the subscription cost?',
              a: 'The Unlimited Plan costs ₹1200 per month, billed monthly, or ₹12000 per year (saving you ₹2400 — the equivalent of 2 months free). Both include full API access, multiple sessions, webhooks, and priority support.',
            },
            {
              q: 'Can I cancel anytime?',
              a: 'Yes. There are no long-term contracts. You can cancel your subscription at any time and you will keep access until the end of your billing period.',
            },
            {
              q: 'Do you offer support?',
              a: 'Subscribers get priority support. Reach out anytime and our team will help you integrate and troubleshoot.',
            },
          ].map(item => (
            <div key={item.q} className="bg-app-surface rounded-xl border border-app-border p-5">
              <h3 className="text-app-text font-semibold">{item.q}</h3>
              <p className="mt-2 text-sm text-app-text-secondary leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-app-border bg-app-surface/50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center">
              <img src={Logo} alt="RelayX Logo" className="w-6 h-6" />
            </div>
            <span className="text-app-text font-semibold text-sm">RelayX</span>
            <span className="text-app-text-muted text-xs">· WhatsApp HTTP API</span>
          </div>
          <p className="text-xs text-app-text-muted">© {new Date().getFullYear()} RelayX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
