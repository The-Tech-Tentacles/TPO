"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  GraduationCap,
  Building2,
  Users,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Award,
  Briefcase,
  BookOpen,
  ChevronRight,
  Star,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

// ─── Animated counter hook ───────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// ─── Intersection observer hook ──────────────────────────────────────────────
function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  value,
  suffix,
  label,
  description,
  inView,
  duration,
}: {
  value: number;
  suffix: string;
  label: string;
  description: string;
  inView: boolean;
  duration?: number;
}) {
  const count = useCountUp(value, duration ?? 1800, inView);
  return (
    <div className="flex flex-col gap-1">
      <div className="text-4xl sm:text-5xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums leading-none">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-base font-semibold text-slate-800 dark:text-slate-100 mt-1">{label}</div>
      <div className="text-sm text-slate-500 dark:text-slate-400 leading-snug">{description}</div>
    </div>
  );
}

const recruiters = [
  "TCS", "Cognizant", "Accenture", "Capgemini",
  "Wipro", "Tech Mahindra", "Hexaware", "Infosys",
];

export default function HomePage() {
  const { ref: statsRef, inView: statsInView } = useInView(0.25);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 antialiased">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-[15px] leading-tight text-slate-900 dark:text-slate-50 tracking-tight">
                ADCET&nbsp;<span className="text-emerald-600 dark:text-emerald-400">TPP</span>
              </p>
              <p className="text-[9px] uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 font-semibold">
                Training &amp; Placement Portal
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            >
              <span className="hidden sm:inline">Portal </span>Login
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-900 py-24 sm:py-32">
        {/* Soft glow blobs */}
        <div
          aria-hidden="true"
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-emerald-400/10 dark:bg-emerald-500/10 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-emerald-400/8 dark:bg-emerald-500/8 blur-3xl pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20 dark:ring-emerald-400/20 mb-8 select-none">
              <Star className="h-3 w-3" />
              Empowering Student Futures · Est. 1983
            </span>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-slate-900 dark:text-slate-50 mb-6 leading-tight">
              Annasaheb Dange College of{" "}
              <span className="whitespace-nowrap text-emerald-600 dark:text-emerald-400">
                Engineering &amp; Technology
              </span>
            </h1>

            <p className="text-lg sm:text-xl leading-8 text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
              Welcome to the official Training &amp; Placement Portal of{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-100">ADCET, Ashta.</span>{" "}
              We connect academic excellence with industry opportunity — shaping engineers into industry leaders.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-emerald-700 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
              >
                Access Student Portal <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              >
                Recruiter Enquiry <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={statsRef}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
          >
            <StatCard
              value={1800}
              suffix="+"
              label="Placement Offers"
              description="Secured across all departments in 2023–24"
              inView={statsInView}
              duration={1600}
            />
            <StatCard
              value={76}
              suffix="+"
              label="Companies Visited"
              description="Top-tier recruiters on campus in 2023–24"
              inView={statsInView}
              duration={1200}
            />
            <StatCard
              value={5}
              suffix=" LPA"
              label="Avg. Package"
              description="Consistent growth across IT &amp; core engineering"
              inView={statsInView}
              duration={1000}
            />
            <StatCard
              value={40}
              suffix="+"
              label="Years of Excellence"
              description="Decades of shaping industry-ready engineers"
              inView={statsInView}
              duration={1400}
            />
          </div>
        </div>
      </section>

      {/* ── Top Recruiters ─────────────────────────────────────────────────── */}
      <section className="py-14 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mb-8">
            Trusted by India's leading companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {recruiters.map((name) => (
              <span
                key={name}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-5 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-default select-none"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── What We Offer ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl mb-4">
              Everything you need, in one place
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              From skill-building workshops to live job drives — the ADCET Training &amp; Placement Cell supports every step of your career journey.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Training Programs",
                desc: "Aptitude, communication, technical skills, and company-specific prep starting from your second year.",
              },
              {
                icon: Briefcase,
                title: "Live Placement Drives",
                desc: "Regular on-campus recruitment drives from 76+ companies across IT, core, and manufacturing sectors.",
              },
              {
                icon: TrendingUp,
                title: "Mock Interviews",
                desc: "Industry-standard mock interviews and GD rounds conducted by experienced HR professionals.",
              },
              {
                icon: Award,
                title: "Career Guidance",
                desc: "One-on-one mentorship and resume review sessions to help you land your dream role.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-500/15 flex items-center justify-center mb-5 group-hover:bg-emerald-600 transition-colors">
                  <Icon className="h-5 w-5 text-emerald-700 dark:text-emerald-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Facilities ─────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3 block">
                Campus Infrastructure
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl mb-5">
                State-of-the-art placement facilities
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                Our campus is purpose-built for efficient, large-scale recruitment drives — giving every visiting company a seamless hiring experience.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              >
                Explore the portal <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-5">
              {[
                {
                  icon: Users,
                  title: "Spacious Auditorium",
                  desc: "800+ seat central auditorium ideal for pre-placement talks and large corporate seminars.",
                },
                {
                  icon: Building2,
                  title: "Dedicated Interview Cabins",
                  desc: "Sound-proof cabins purpose-built for personal interviews and group discussion rounds.",
                },
                {
                  icon: MapPin,
                  title: "High-Capacity Labs",
                  desc: "Advanced computer labs with high-speed internet to run online assessments for hundreds simultaneously.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-5 bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-sm transition-all"
                >
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-500/15 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">{title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ────────────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-emerald-900 dark:bg-emerald-950 rounded-3xl overflow-hidden shadow-xl">
            <div className="grid md:grid-cols-2">
              {/* Left — contact info */}
              <div className="p-10 md:p-16">
                <span className="text-xs font-semibold uppercase tracking-widest text-emerald-300/70 mb-3 block">
                  Reach out
                </span>
                <h2 className="text-3xl font-bold text-white mb-3">Get in Touch</h2>
                <p className="text-emerald-100/80 mb-10 text-base leading-relaxed">
                  Contact the Training &amp; Placement Cell for recruitment partnerships, student enquiries, or general information.
                </p>

                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="shrink-0 bg-emerald-800 p-2.5 rounded-lg text-emerald-300">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-emerald-300/70 uppercase tracking-wider">Phone</p>
                      <a
                        href="tel:8055728941"
                        className="text-base font-semibold text-white hover:text-emerald-200 transition-colors"
                      >
                        +91 80557 28941
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="shrink-0 bg-emerald-800 p-2.5 rounded-lg text-emerald-300">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-emerald-300/70 uppercase tracking-wider">Email</p>
                      <a
                        href="mailto:dean_tpo@adcet.in"
                        className="text-base font-semibold text-white hover:text-emerald-200 transition-colors block"
                      >
                        dean_tpo@adcet.in
                      </a>
                      <a
                        href="mailto:hrd.adcet@gmail.com"
                        className="text-sm text-emerald-200/80 hover:text-emerald-200 transition-colors"
                      >
                        hrd.adcet@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="shrink-0 bg-emerald-800 p-2.5 rounded-lg text-emerald-300">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-emerald-300/70 uppercase tracking-wider">Address</p>
                      <p className="text-sm text-white leading-relaxed">
                        Ashta, Sangli – Miraj – Kolhapur Rd,<br />
                        Ashta, Maharashtra 416301
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — TPO card */}
              <div className="bg-emerald-800/60 dark:bg-emerald-900/60 p-10 md:p-16 flex flex-col justify-center">
                <div className="bg-white/10 rounded-2xl p-8 border border-white/15 backdrop-blur-sm">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-700/60 flex items-center justify-center mb-5">
                    <GraduationCap className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-0.5">Mr. Sandip S. Magdum</h3>
                  <p className="text-emerald-300 text-sm font-medium mb-5">
                    Dean — Training &amp; Placement Officer
                  </p>
                  <p className="text-emerald-100/80 text-sm leading-relaxed mb-6">
                    Our dedicated team of staff and student coordinators work tirelessly to ensure the best opportunities for students and a seamless hiring experience for corporate partners.
                  </p>
                  <div className="w-full h-px bg-white/15 mb-5" />
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-emerald-300 text-xs uppercase tracking-widest font-semibold">
                      ADCET Ashta Campus · Active
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Left — copyright */}
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center md:text-left">
              &copy; {new Date().getFullYear()} Annasaheb Dange College of Engineering and Technology, Ashta.{" "}
              <span className="hidden sm:inline">All rights reserved.</span>
            </p>

            {/* Right — attribution + toggle */}
            <div className="flex items-center gap-5">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Built by{" "}
                <a
                  href="https://github.com/The-Tech-Tentacles"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors underline-offset-2 hover:underline"
                >
                  The Tech Tentacles
                </a>
              </p>
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}
