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
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function HomePage() {
  const features = [
    {
      icon: Stethoscope,
      title: "AI Symptom Checker",
      description: "Intelligent diagnosis powered by offline AI",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      gradient: "from-emerald-500/20 to-emerald-500/5",
    },
    {
      icon: MapPin,
      title: "Healthcare Finder",
      description: "GPS-enabled facility locator with real-time data",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      gradient: "from-blue-500/20 to-blue-500/5",
    },
    {
      icon: Video,
      title: "Telemedicine",
      description: "HD video consultations with specialists",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      gradient: "from-purple-500/20 to-purple-500/5",
    },
    {
      icon: Ambulance,
      title: "Emergency SOS",
      description: "Instant emergency response with GPS tracking",
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      gradient: "from-red-500/20 to-red-500/5",
    },
    {
      icon: MessageSquare,
      title: "AI Medical Assistant",
      description: "24/7 intelligent health guidance via chat",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      gradient: "from-cyan-500/20 to-cyan-500/5",
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
      features: ["Book consultations", "Check symptoms", "Emergency assistance", "Health records"],
      icon: Heart,
    },
    {
      title: "For Doctors",
      description: "Reach patients in remote areas",
      features: ["Virtual consultations", "Patient management", "Medical records", "Flexible schedule"],
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
    <div className="flex flex-col min-h-screen">
      <motion.header
        className="sticky top-0 z-50 w-full border-b glass-dark"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-gradient">ShusthoBondhu</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">স্বাস্থ্য বন্ধু - Your Health Companion</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild className="hidden sm:inline-flex hover:bg-white/5">
              <Link href="#features">Features</Link>
            </Button>
            <Button variant="ghost" asChild className="hidden sm:inline-flex hover:bg-white/5">
              <Link href="#how-it-works">How It Works</Link>
            </Button>
            <Button variant="outline" asChild className="glass border-white/10 bg-transparent">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild className="gradient-primary border-0">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </nav>
        </div>
      </motion.header>

      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--medical-blue)]/20 via-transparent to-[var(--medical-teal)]/20 pointer-events-none" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--medical-blue)]/30 rounded-full filter blur-3xl animate-float" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--medical-teal)]/30 rounded-full filter blur-3xl animate-float"
            style={{ animationDelay: "3s" }}
          />
        </div>
        <div className="container relative">
          <motion.div
            className="max-w-4xl mx-auto text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Bringing Healthcare to Rural Bangladesh</span>
            </motion.div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-balance">
              Medical Support for the <span className="text-gradient">Hill Tracts</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground/90 text-balance max-w-2xl mx-auto leading-relaxed">
              Access quality healthcare services even with limited internet. Connect with doctors, find nearby
              facilities, and get emergency help when you need it most.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="w-full sm:w-auto gradient-primary border-0 h-12 px-8 text-base">
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
                className="w-full sm:w-auto glass border-white/10 h-12 px-8 text-base bg-transparent"
              >
                <Link href="/emergency" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Emergency SOS
                </Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground pt-4">
              <motion.div className="flex items-center gap-2 px-3 py-2 rounded-lg glass" whileHover={{ scale: 1.05 }}>
                <Wifi className="w-4 h-4 text-[var(--medical-teal)]" />
                <span>Works Offline</span>
              </motion.div>
              <motion.div className="flex items-center gap-2 px-3 py-2 rounded-lg glass" whileHover={{ scale: 1.05 }}>
                <Shield className="w-4 h-4 text-[var(--medical-blue)]" />
                <span>Secure & Private</span>
              </motion.div>
              <motion.div className="flex items-center gap-2 px-3 py-2 rounded-lg glass" whileHover={{ scale: 1.05 }}>
                <Clock className="w-4 h-4 text-[var(--medical-purple)]" />
                <span>24/7 Available</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
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
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
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
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              Everything You Need for <span className="text-gradient">Better Healthcare</span>
            </h2>
            <p className="text-lg text-muted-foreground/90">
              Comprehensive medical support designed for areas with limited internet access
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
                <Card className="h-full glass border-white/5 hover:border-white/10 transition-all group">
                  <CardHeader>
                    <motion.div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <feature.icon className={`w-7 h-7 ${feature.color}`} />
                    </motion.div>
                    <CardTitle className="text-xl group-hover:text-gradient transition-all">{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Built for Everyone in Healthcare</h2>
            <p className="text-lg text-muted-foreground">
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
                <Card className="h-full">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <type.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{type.title}</CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {type.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How MediConnect Works</h2>
            <p className="text-lg text-muted-foreground">Simple, fast, and works even with limited connectivity</p>
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
                  description: "Find healthcare providers, check symptoms, or locate facilities.",
                  icon: Activity,
                },
                {
                  step: "03",
                  title: "Get Care",
                  description: "Receive medical support through video, chat, or in-person visits.",
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
                  <div className="text-6xl font-bold text-primary/10 mb-4">{item.step}</div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--medical-blue)]/10 via-[var(--medical-purple)]/5 to-[var(--medical-teal)]/10" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-transparent" />
        </div>
        <div className="container relative">
          <motion.div
            className="max-w-3xl mx-auto text-center space-y-8 p-8 glass rounded-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-5xl font-bold">
              Ready to Transform <span className="text-gradient">Healthcare Access</span>?
            </h2>
            <p className="text-lg text-muted-foreground/90">
              Join thousands already receiving quality healthcare support in rural Bangladesh
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="w-full sm:w-auto gradient-primary border-0 h-12 px-8">
                <Link href="/auth/sign-up" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Create Free Account
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto glass border-white/10 h-12 px-8 bg-transparent"
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">MediConnect</h3>
                  <p className="text-xs text-muted-foreground">Healthcare for All</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Bringing quality medical support to Bangladesh&apos;s Hill Tracts and rural regions through technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="hover:text-foreground transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/auth/sign-up" className="hover:text-foreground transition-colors">
                    Get Started
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Emergency
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 MediConnect. Built with care for rural healthcare access.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
