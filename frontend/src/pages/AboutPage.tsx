import {
    Brain,
    CheckCircle,
    Github,
    Instagram,
    Layers,
    Lightbulb,
    Linkedin,
    Mail,
    Network,
    Rocket,
    Search,
    ShieldCheck,
    Target,
} from 'lucide-react'
import type { ElementType } from 'react';
import { Particles } from '../components/Particles';
import authorImg from '../assets/photo1.jpg'

export function AboutPage() {
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

            {/* Header */}
            <div className="relative z-10 border-b border-white/10 bg-neutral-900/50 py-16 text-center backdrop-blur-sm">
                <h1 className="bg-linear-to-br from-white via-white to-white/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">About TerraGuard</h1>
                <p className="mt-4 text-lg text-neutral-400">Engineering a safer future through predictive AI</p>
            </div>

            <div className="relative z-10 mx-auto max-w-4xl space-y-24 px-4 py-16">

                {/* Project Purpose */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 text-indigo-400">
                        <Target className="h-6 w-6" />
                        <h2 className="text-2xl font-bold text-white">Project Purpose</h2>
                    </div>
                    <p className="text-lg leading-relaxed text-neutral-300">
                        Landslides are among the most destructive natural disasters, causing significant loss of life and infrastructure damage annually.
                        Terraguard aims to bridge the gap between reactive disaster management and proactive risk mitigation. By deploying an
                        intelligent system that monitors, analyzes, and predicts slope stability in real-time, we empower communities and authorities
                        to take action <span className="text-white font-medium">before</span> disaster strikes.
                    </p>
                </section>

                {/* Motivation */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 text-amber-400">
                        <Lightbulb className="h-6 w-6" />
                        <h2 className="text-2xl font-bold text-white">Motivation</h2>
                    </div>
                    <div className="rounded-2xl bg-neutral-900/50 p-6 ring-1 ring-white/10 backdrop-blur-sm">
                        <p className="text-neutral-300">
                            The increasing frequency of extreme weather events due to climate change has made traditional, manual monitoring techniques obsolete.
                            Static geological surveys miss the dynamic, rapid changes that precede a landslide. Our motivation stems from the urgent need for a
                            <span className="text-white font-medium"> continuous, automated, and highly accurate</span> early warning system that operates 24/7 in all weather conditions.
                        </p>
                    </div>
                </section>

                {/* Methodology */}
                <section className="space-y-8">
                    <div className="flex items-center gap-3 text-emerald-400">
                        <Network className="h-6 w-6" />
                        <h2 className="text-2xl font-bold text-white">Methodology</h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <MethodCard
                            title="Feature Engineering"
                            icon={Search}
                            desc="Extracted critical time-domain features from raw sensor data, including statistical moments (mean, skewness, kurtosis) and rate-of-change metrics to capture slope dynamics."
                        />
                        <MethodCard
                            title="Sliding Window Approach"
                            icon={Layers}
                            desc="Implemented a temporal sliding window technique to feed the model with historical context, allowing it to detect trends and patterns over time rather than isolated data points."
                        />
                        <MethodCard
                            title="Class Balancing"
                            icon={CheckCircle}
                            desc="Applied Synthetic Minority Over-sampling Technique (SMOTE) to address data imbalance, ensuring the model is equally sensitive to rare 'Hazardous' events as it is to 'Safe' states."
                        />
                        <MethodCard
                            title="Stacking Ensemble"
                            icon={Brain}
                            desc="Developed a robust Meta-Model that aggregates predictions from multiple base learners (Random Forest, XGBoost, Gradient Boosting) to maximize accuracy and reduce variance."
                        />
                    </div>
                </section>

                {/* Future Scope */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 text-sky-400">
                        <Rocket className="h-6 w-6" />
                        <h2 className="text-2xl font-bold text-white">Future Scope</h2>
                    </div>
                    <ul className="space-y-4">
                        <ScopeItem title="IoT Integration" desc="Deployment of low-power, wide-area network (LoRaWAN) sensor nodes for large-scale field implementation." />
                        <ScopeItem title="Mobile Alerts" desc="Development of a companion mobile app for push notifications to local residents and emergency responders." />
                        <ScopeItem title="Satellite Data Fusion" desc="Incorporating InSAR satellite imagery to monitor ground deformation over vast areas." />
                        <ScopeItem title="Explainable AI (XAI)" desc="Integrating SHAP values to provide transparent reasoning behind every risk alert." />
                    </ul>
                </section>

                {/* Author Section */}
                <section className="border-t border-white/10 pt-16">
                    <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">Meet the Developer</h2>
                    <div className="mx-auto max-w-2xl rounded-3xl bg-neutral-900/80 p-8 text-center ring-1 ring-white/10 backdrop-blur-sm">
                        <div className="mx-auto mb-6 h-24 w-24 overflow-hidden rounded-full bg-indigo-500/20 ring-2 ring-indigo-500/50">
                            <img
                                src={authorImg}
                                alt="Author"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Priyanshu Thakur</h3>
                        <p className="mt-2 text-indigo-400">B.Tech in Computer Science & Engineering</p>
                        <p className="mt-4 text-neutral-400">
                            Passionate about applying Artificial Intelligence to solve real-world engineering challenges.
                            Specializing in Machine Learning, Data Science, and Full-Stack Development.
                        </p>

                        <div className="mt-8 flex justify-center gap-4">
                            <SocialLink href="https://github.com/PriyanshuThakur33" icon={Github} />
                            <SocialLink href="https://www.linkedin.com/in/priyanshuthakur33/" icon={Linkedin} />
                            <SocialLink href="https://mail.google.com/mail/?view=cm&to=priyanshuthakurbaggi@email.com&su=TerraGuard Inquiry" icon={Mail} />
                        </div>
                    </div>
                </section>

            </div>

            {/* Footer Reuse */}
            <footer className="relative z-10 border-t border-white/10 bg-neutral-950 py-12">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 md:flex-row">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-6 w-6 text-green-700" />
                        <span className="font-semibold text-white">TerraGuard Systems</span>
                    </div>

                    <div className="flex gap-4">
                        <SocialLink href="https://github.com/PriyanshuThakur33" icon={Github} />
                        <SocialLink href="https://www.linkedin.com/in/priyanshuthakur33/" icon={Linkedin} />
                        <SocialLink href="https://www.instagram.com/33priyanshu_/" icon={Instagram} />
                        <SocialLink href="https://mail.google.com/mail/?view=cm&to=priyanshuthakurbaggi@email.com&su=TerraGuard Inquiry" icon={Mail} />
                    </div>

                    <div className="text-sm text-neutral-500">
                        © 2026 TerraGuard. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    )
}

function MethodCard({ title, icon: Icon, desc }: { title: string; icon: ElementType; desc: string }) {
    return (
        <div className="rounded-xl bg-neutral-900/40 p-6 ring-1 ring-white/10 transition hover:bg-neutral-900/60 backdrop-blur-sm">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                <Icon className="h-5 w-5" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm leading-relaxed text-neutral-400">{desc}</p>
        </div>
    )
}

function ScopeItem({ title, desc }: { title: string; desc: string }) {
    return (
        <li className="flex gap-4">
            <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-sky-400">
                <CheckCircle className="h-4 w-4" />
            </div>
            <div>
                <h4 className="font-semibold text-white">{title}</h4>
                <p className="text-sm text-neutral-400">{desc}</p>
            </div>
        </li>
    )
}

function SocialLink({ href, icon: Icon }: { href: string; icon: ElementType }) {
    return (
        <a
            href={href}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-indigo-500 hover:text-white"
        >
            <Icon className="h-5 w-5" />
        </a>
    )
}
