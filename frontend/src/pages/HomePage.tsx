import {
    Activity,
    ArrowRight,
    BarChart3,
    Brain,
    Cpu,
    Github,
    Globe,
    Instagram,
    Layers,
    Linkedin,
    Mail,
    MapPinned,
    PlayCircle,
    Server,
    ShieldCheck,
    Zap,
} from 'lucide-react'
import type { ElementType } from 'react';
import { Link } from 'react-router-dom'
import { Particles } from '../components/Particles'
import authorImg from '../assets/photo1.jpg'

export function HomePage() {
    return (
        <div className="relative min-h-screen bg-neutral-950 text-white selection:bg-neutral-500/30">
            {/* Particles Background */}
            <Particles
                className="fixed inset-0 z-0"
                quantity={100}
                ease={80}
                color="#ffffff"
                refresh
            />

            {/* Hero Section */}
            <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 text-center z-10">
                <div className="absolute inset-0 -z-20">
                    <img
                        src="/media/download1.jpg"
                        alt="Mountains"
                        className="h-full w-full object-cover blur-[3px]"
                    />
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-indigo-900/20 via-neutral-950/80 to-neutral-950 -z-10" />

                <div className="relative z-10 max-w-4xl space-y-8 animate-in fade-in zoom-in duration-1000">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-black/50 ring-1 ring-neutral-100/30 backdrop-blur-sm">
                        <Activity className="h-8 w-8 text-green-700" />
                    </div>

                    <h1 className="bg-linear-to-br from-white via-white to-white/60 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-7xl">
                        TerraGuard
                    </h1>

                    <p className="mx-auto max-w-2xl text-lg text-neutral-400 sm:text-xl">
                        AI-Based Landslide Early Warning System. Real-time monitoring, predictive simulation, and geospatial risk visualization for a safer tomorrow.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                            to="/dashboard"
                            className="group inline-flex items-center gap-2 rounded-full bg-green-900 px-6 py-3 font-semibold text-white transition hover:bg-green-700 hover:shadow-lg hover:shadow-green-700/25"
                        >
                            <BarChart3 className="h-4 w-4" />
                            Live Dashboard
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            to="/simulation"
                            className="inline-flex items-center gap-2 rounded-full bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10 ring-1 ring-white/10"
                        >
                            <PlayCircle className="h-4 w-4" />
                            Simulation
                        </Link>
                        <Link
                            to="/map"
                            className="inline-flex items-center gap-2 rounded-full bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10 ring-1 ring-white/10"
                        >
                            <MapPinned className="h-4 w-4" />
                            Map View
                        </Link>
                    </div>
                </div>
            </section>

            {/* Motivation & Aim */}
            <section className="relative py-24 z-10">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="grid gap-16 lg:grid-cols-2">
                        <div className="space-y-6">
                            <div className="inline-flex rounded-full bg-rose-500/10 px-3 py-1 text-sm font-semibold text-rose-400 ring-1 ring-rose-500/20">
                                The Challenge
                            </div>
                            <h2 className="text-3xl font-bold sm:text-4xl">Unpredictable Terrain in a Changing Climate</h2>
                            <p className="text-lg leading-relaxed text-neutral-400">
                                Increasing global temperatures and shifting weather patterns have led to unstable terrain and frequent landslides.
                                Traditional monitoring methods differ significantly in latency and accuracy. We need a system that doesn't just monitor,
                                but <span className="text-white font-medium">anticipates</span> disaster.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <div className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
                                Our Solution
                            </div>
                            <h2 className="text-3xl font-bold sm:text-4xl">Proactive AI-Powered Defense</h2>
                            <p className="text-lg leading-relaxed text-neutral-400">
                                Terraguard leverages ensemble Machine Learning and Deep Learning models to analyze real-time sensor data. By detecting subtle
                                shifts in slope, soil moisture, and seismic activity, we provide early warnings that save lives and infrastructure.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="bg-neutral-900/50 py-24 z-10 relative backdrop-blur-xs">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-bold sm:text-4xl">Core Capabilities</h2>
                        <p className="mt-4 text-neutral-400">Comprehensive tools for monitoring and risk assessment</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {[
                            {
                                icon: BarChart3,
                                color: 'text-indigo-400',
                                bg: 'bg-indigo-500/10',
                                title: 'Live Dashboard',
                                desc: 'Real-time telemetry of hazard levels, displacement, and active alerts.'
                            },
                            {
                                icon: Brain,
                                color: 'text-amber-400',
                                bg: 'bg-amber-500/10',
                                title: 'Predictive Simulation',
                                desc: 'Run logical loops and test system response to various hazard scenarios.'
                            },
                            {
                                icon: MapPinned,
                                color: 'text-emerald-400',
                                bg: 'bg-emerald-500/10',
                                title: 'Geospatial Map',
                                desc: 'Visual risk assessment across monitored nodes with status overlays.'
                            }
                        ].map((f, i) => (
                            <div key={i} className="group relative overflow-hidden rounded-2xl bg-neutral-950/80 p-8 ring-1 ring-white/10 transition hover:bg-neutral-900/80">
                                <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.bg} ${f.color}`}>
                                    <f.icon className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold">{f.title}</h3>
                                <p className="text-neutral-400">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* System Architecture */}
            <section className="py-24 z-10 relative">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-bold sm:text-4xl">System Architecture</h2>
                        <p className="mt-4 text-neutral-400">Data flow from sensor to actionable insight</p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="absolute top-1/2 left-4 right-4 hidden h-0.5 -translate-y-1/2 bg-linear-to-r from-transparent via-red-500/30 to-transparent lg:block" />

                        <div className="grid gap-8 lg:grid-cols-5">
                            {[
                                { title: 'Sensors', icon: Activity, step: '01' },
                                { title: 'Preprocessing', icon: Zap, step: '02' },
                                { title: 'Base Models', icon: Layers, step: '03' },
                                { title: 'Meta Model', icon: Brain, step: '04' },
                                { title: 'Visualization', icon: Globe, step: '05' },
                            ].map((step, i) => (
                                <div key={i} className="relative flex flex-col items-center text-center">
                                    <div className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-950 ring-1 ring-white/10 transition hover:scale-110 hover:ring-red-500/50">
                                        <step.icon className="h-6 w-6 text-neutral-500" />
                                        <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-900/70 text-xs font-bold text-white">
                                            {step.step}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold">{step.title}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="bg-neutral-900/30 py-24 z-10 relative">
                <div className="mx-auto max-w-5xl px-4">
                    <div className="overflow-hidden rounded-3xl bg-neutral-950/80 p-8 ring-1 ring-white/10 md:p-12">
                        <div className="grid gap-12 md:grid-cols-2">
                            <div>
                                <h2 className="mb-6 text-2xl font-bold text-white">Technology Stack</h2>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <Brain className="mt-1 h-5 w-5 text-yellow-600" />
                                        <div>
                                            <h3 className="font-semibold text-white">ML / DL</h3>
                                            <p className="text-sm text-neutral-400">Time-series analysis, Ensemble Stacking, RF & XGBoost base models, LSTM as meta model.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <Server className="mt-1 h-5 w-5 text-yellow-600" />
                                        <div>
                                            <h3 className="font-semibold text-white">Backend</h3>
                                            <p className="text-sm text-neutral-400">Python FastAPI for high-performance inference serving and data processing.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <Cpu className="mt-1 h-5 w-5 text-yellow-600" />
                                        <div>
                                            <h3 className="font-semibold text-white">Frontend</h3>
                                            <p className="text-sm text-neutral-400">React, TypeScript, TailwindCSS for a responsive, modern glassmorphic UI.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col justify-center rounded-2xl bg-yellow-600/5 p-6 ring-1 ring-yellow-500/10">
                                <Quote>
                                    "Terraguard represents the convergence of geotechnical engineering and modern AI, providing a scalable solution for disaster management."
                                </Quote>
                                <div className="mt-6 flex items-center gap-3">
                                    <div className="h-10 w-10 overflow-hidden rounded-full bg-neutral-800 ring-1 ring-white/10">
                                        <img
                                            src={authorImg}
                                            alt="Author"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div>
                                        <div className="text-sm font-semibold text-white">Priyanshu Thakur</div>
                                        <div className="text-xs text-neutral-400">Lead Developer</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer / Contact */}
            <footer className="border-t border-white/10 bg-neutral-950 py-12 z-10 relative">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 md:flex-row">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-6 w-6 text-green-700" />
                        <span className="font-semibold text-white">TerraGuard Systems</span>
                    </div>

                    <div className="flex gap-4">
                        <SocialLink href="https://github.com/PriyanshuThakur33" icon={Github} label="GitHub" />
                        <SocialLink href="https://www.linkedin.com/in/priyanshuthakur33/" icon={Linkedin} label="LinkedIn" />
                        <SocialLink href="https://www.instagram.com/33priyanshu_/" icon={Instagram} label="Instagram" />
                        <SocialLink href="https://mail.google.com/mail/?view=cm&to=priyanshuthakurbaggi@email.com&su=TerraGuard Inquiry" icon={Mail} label="Email" />
                    </div>

                    <div className="text-sm text-neutral-500">
                        © 2026 TerraGuard. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    )
}

function SocialLink({ href, icon: Icon, label }: { href: string; icon: ElementType; label: string }) {
    return (
        <a
            href={href}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-indigo-500 hover:text-white"
            aria-label={label}
        >
            <Icon className="h-5 w-5" />
        </a>
    )
}

function Quote({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative">
            <div className="text-lg font-medium italic text-slate-300">"{children}"</div>
        </div>
    )
}
