"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Heart,
  Stethoscope,
  MapPin,
  Users,
  Activity,
  Ambulance,
  Video,
  MessageSquare,
  Shield,
  Wifi,
  Clock,
  ChevronRight,
  Sparkles,
  Zap,
  Brain,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function HomePage() {
  const features = [
    {
      icon: Brain,
      title: "AI Symptom Checker",
      description: "Intelligent diagnosis powered by advanced AI models",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      gradient: "from-emerald-500/20 to-emerald-500/5",
    },
    {
      icon: MapPin,
      title: "Healthcare Finder",
      description: "GPS-enabled facility locator with real-time data",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      gradient: "from-cyan-500/20 to-cyan-500/5",
    },
    {
      icon: Video,
      title: "Telemedicine",
      description: "HD video consultations with specialists",
      color: "text-violet-400",
      bgColor: "bg-violet-500/10",
      gradient: "from-violet-500/20 to-violet-500/5",
    },
    {
      icon: Ambulance,
      title: "Emergency SOS",
      description: "Instant emergency response with GPS tracking",
      color: "text-rose-400",
      bgColor: "bg-rose-500/10",
      gradient: "from-rose-500/20 to-rose-500/5",
    },
    {
      icon: MessageSquare,
      title: "AI Medical Assistant",
      description: "24/7 intelligent health guidance via chat",
      color: "text-sky-400",
      bgColor: "bg-sky-500/10",
      gradient: "from-sky-500/20 to-sky-500/5",
    },
    {
      icon: Users,
      title: "Community Network",
      description: "Connect with local health workers instantly",
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      gradient: "from-amber-500/20 to-amber-500/5",
    },
  ]

  const userTypes = [
    {
      title: "For Patients",
      description: "Access quality healthcare from anywhere",
      features: ["Book consultations", "AI symptom checker", "Emergency assistance", "Health records"],
      icon: Heart,
    },
    {
      title: "For Doctors",
      description: "Reach patients in remote areas",
      features: ["Virtual consultations", "Patient management", "AI-assisted diagnosis", "Flexible schedule"],
      icon: Stethoscope,
    },
    {
      title: "For Health Workers",
      description: "Coordinate community healthcare",
      features: ["Emergency response", "Patient referrals", "Health monitoring", "Resource management"],
      icon: Users,
    },
  ]

  const stats = [
    { label: "Districts Covered", value: "64", icon: MapPin },
    { label: "Medical Facilities", value: "500+", icon: Activity },
    { label: "Healthcare Providers", value: "200+", icon: Stethoscope },
    { label: "Active Users", value: "10K+", icon: Users },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-950">
      <motion.header
        className="sticky top-0 z-50 w-full border-b border-emerald-800/30 bg-slate-950/80 backdrop-blur-xl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Bisheshoggo AI
              </h1>
              <p className="text-xs text-emerald-300/60 hidden sm:block">বিশেষজ্ঞ AI - Expert Healthcare</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild className="hidden sm:inline-flex text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10">
              <Link href="#features">Features</Link>
            </Button>
            <Button variant="ghost" asChild className="hidden sm:inline-flex text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10">
              <Link href="#how-it-works">How It Works</Link>
            </Button>
            <Button variant="outline" asChild className="border-emerald-700 text-emerald-400 hover:bg-emerald-500/10">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 border-0 text-white shadow-lg shadow-emerald-500/20">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </nav>
        </div>
      </motion.header>

      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-violet-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "4s" }} />
        </div>
        <div className="container relative">
          <motion.div
            className="max-w-4xl mx-auto text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20"
              whileHover={{ scale: 1.05 }}
            >
              <Brain className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">AI-Powered Healthcare for Rural Bangladesh</span>
            </motion.div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-balance text-white">
              Your Expert AI{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Healthcare Partner
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 text-balance max-w-2xl mx-auto leading-relaxed">
              Access world-class healthcare services powered by AI. Connect with doctors, check symptoms instantly, 
              and get emergency help when you need it - all designed for Bangladesh's Hill Tracts.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 border-0 h-12 px-8 text-base text-white shadow-lg shadow-emerald-500/30">
                <Link href="/auth/sign-up" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Get Started Free
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto border-rose-700 text-rose-400 hover:bg-rose-500/10 h-12 px-8 text-base"
              >
                <Link href="/emergency" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Emergency SOS
                </Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 pt-4">
              <motion.div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700" whileHover={{ scale: 1.05 }}>
                <Wifi className="w-4 h-4 text-emerald-400" />
                <span>Works Offline</span>
              </motion.div>
              <motion.div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700" whileHover={{ scale: 1.05 }}>
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Secure & Private</span>
              </motion.div>
              <motion.div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700" whileHover={{ scale: 1.05 }}>
                <Clock className="w-4 h-4 text-violet-400" />
                <span>24/7 AI Support</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-emerald-800/30 bg-slate-900/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-center mb-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10">
                    <stat.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="container">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-5xl font-bold mb-4 text-white">
              Everything You Need for{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Better Healthcare
              </span>
            </h2>
            <p className="text-lg text-slate-400">
              Comprehensive AI-powered medical support designed for areas with limited internet access
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full bg-slate-900/50 border-slate-800 hover:border-emerald-700/50 transition-all group">
                  <CardHeader>
                    <motion.div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <feature.icon className={`w-7 h-7 ${feature.color}`} />
                    </motion.div>
                    <CardTitle className="text-xl text-white group-hover:text-emerald-400 transition-all">{feature.title}</CardTitle>
                    <CardDescription className="text-base text-slate-400">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="container">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Built for Everyone in Healthcare</h2>
            <p className="text-lg text-slate-400">
              Whether you&apos;re seeking care or providing it, we&apos;ve got you covered
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {userTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-slate-900/80 border-slate-800">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                      <type.icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <CardTitle className="text-white">{type.title}</CardTitle>
                    <CardDescription className="text-slate-400">{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {type.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">How Bisheshoggo AI Works</h2>
            <p className="text-lg text-slate-400">Simple, fast, and works even with limited connectivity</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Sign Up",
                  description: "Create your free account in minutes. Works on any device.",
                  icon: Users,
                },
                {
                  step: "02",
                  title: "Connect",
                  description: "Find healthcare providers, check symptoms with AI, or locate facilities.",
                  icon: Brain,
                },
                {
                  step: "03",
                  title: "Get Care",
                  description: "Receive AI-assisted medical support through video, chat, or in-person visits.",
                  icon: Heart,
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="text-6xl font-bold text-emerald-500/10 mb-4">{item.step}</div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                  <p className="text-slate-400">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-emerald-500/10" />
        <div className="container relative">
          <motion.div
            className="max-w-3xl mx-auto text-center space-y-8 p-8 bg-slate-900/80 border border-emerald-800/50 rounded-3xl backdrop-blur-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-5xl font-bold text-white">
              Ready for{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                AI-Powered Healthcare
              </span>
              ?
            </h2>
            <p className="text-lg text-slate-400">
              Join thousands already receiving quality healthcare support in rural Bangladesh
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 border-0 h-12 px-8 text-white shadow-lg shadow-emerald-500/30">
                <Link href="/auth/sign-up" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Create Free Account
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto border-emerald-700 text-emerald-400 hover:bg-emerald-500/10 h-12 px-8"
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-emerald-800/30 py-12 bg-slate-950">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Bisheshoggo AI</h3>
                  <p className="text-xs text-emerald-400/70">বিশেষজ্ঞ AI - Expert Healthcare</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Bringing AI-powered quality medical support to Bangladesh&apos;s Hill Tracts and rural regions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="#features" className="hover:text-emerald-400 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="hover:text-emerald-400 transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/auth/sign-up" className="hover:text-emerald-400 transition-colors">
                    Get Started
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Emergency
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-400 transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
            <p>&copy; 2025 Bisheshoggo AI. Built with ❤️ for rural healthcare access in Bangladesh.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
