"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Stethoscope,
  MapPin,
  Video,
  FileText,
  Calendar,
  Activity,
  Ambulance,
  LogOut,
  User,
  Settings,
  Menu,
  Bell,
  ChevronRight,
  Bot,
  Scan,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import type { Profile, PatientProfile, SymptomCheck, Consultation } from "@/lib/types"

interface DashboardContentProps {
  user: { email: string; id: string }
  profile: Profile | null
  patientProfile: PatientProfile | null
  recentSymptomChecks: SymptomCheck[]
  upcomingConsultations: Consultation[]
  recordsCount: number
}

export function DashboardContent({
  user,
  profile,
  patientProfile,
  recentSymptomChecks,
  upcomingConsultations,
  recordsCount,
}: DashboardContentProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      // Clear token from localStorage
      localStorage.removeItem('bisheshoggo_token')
      // Redirect to login
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = [
    {
      icon: Stethoscope,
      title: "Offline Dr",
      description: "AI-powered offline medical assistant",
      href: "/check-symptoms",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      icon: Ambulance,
      title: "Emergency SOS",
      description: "One-tap emergency alert",
      href: "/emergency",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      icon: Bot,
      title: "AI Medical Assistant",
      description: "Chat with AI doctor",
      href: "/dashboard/ai-chat",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      icon: Scan,
      title: "Scan Prescription",
      description: "OCR prescription analysis",
      href: "/dashboard/scan-prescription",
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      icon: MapPin,
      title: "Find Volunteers",
      description: "Connect with volunteer doctors",
      href: "/dashboard/volunteers",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Video,
      title: "Telemedicine",
      description: "Video consultations",
      href: "/dashboard/consultations",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ]

  const stats = [
    {
      label: "Health Checks",
      value: recentSymptomChecks.length,
      icon: Activity,
      color: "text-emerald-500",
    },
    {
      label: "Consultations",
      value: upcomingConsultations.length,
      icon: Video,
      color: "text-purple-500",
    },
  ]

  const NavItems = () => (
    <>
      <Link
        href="/dashboard"
        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium"
      >
        <Heart className="w-5 h-5" />
        <span>Dashboard</span>
      </Link>
      <Link
        href="/check-symptoms"
        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
      >
        <Stethoscope className="w-5 h-5" />
        <span>Offline Dr</span>
      </Link>
      <Link
        href="/emergency"
        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors"
      >
        <Ambulance className="w-5 h-5" />
        <span>Emergency SOS</span>
      </Link>
      <Link
        href="/dashboard/ai-chat"
        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
      >
        <Bot className="w-5 h-5" />
        <span>AI Assistant</span>
      </Link>
      <Link
        href="/dashboard/scan-prescription"
        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
      >
        <Scan className="w-5 h-5" />
        <span>Scan Prescription</span>
      </Link>
      <Link
        href="/dashboard/volunteers"
        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
      >
        <MapPin className="w-5 h-5" />
        <span>Find Volunteers</span>
      </Link>
      <Link
        href="/dashboard/consultations"
        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
      >
        <Video className="w-5 h-5" />
        <span>Telemedicine</span>
      </Link>
      <Link href="/history" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors">
        <Activity className="w-5 h-5" />
        <span>Case History</span>
      </Link>
      <Link
        href="/chw-dashboard"
        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
      >
        <User className="w-5 h-5" />
        <span>CHW Dashboard</span>
      </Link>
    </>
  )

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-card">
        <div className="p-6 border-b">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Bisheshoggo AI" width={40} height={40} className="rounded-xl" />
            <div>
              <h1 className="text-lg font-bold">Bisheshoggo AI</h1>
              <p className="text-xs text-muted-foreground">Doctor you need</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItems />
        </nav>

        <div className="p-4 border-t space-y-2">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
          <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut} disabled={isLoading}>
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
          <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="p-6 border-b">
                  <div className="flex items-center gap-2">
                    <Image src="/logo.png" alt="Bisheshoggo AI" width={40} height={40} className="rounded-xl" />
                    <div>
                      <h1 className="text-lg font-bold">Bisheshoggo AI</h1>
                      <p className="text-xs text-muted-foreground">Doctor you need</p>
                    </div>
                  </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                  <NavItems />
                </nav>

                <div className="p-4 border-t space-y-2">
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut} disabled={isLoading}>
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex-1">
              <h2 className="text-lg font-semibold lg:hidden">Dashboard</h2>
            </div>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </Button>

            <Link href="/dashboard/profile">
              <Avatar className="h-9 w-9">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 lg:p-6 space-y-6">
          {/* Welcome Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold">Welcome back, {profile?.full_name}!</h1>
                <p className="text-muted-foreground">Here&apos;s your health dashboard overview</p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Link href={action.href}>
                    <Card className="hover:shadow-lg transition-all cursor-pointer group">
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 rounded-xl ${action.bgColor} flex items-center justify-center mb-4`}>
                          <action.icon className={`w-6 h-6 ${action.color}`} />
                        </div>
                        <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Upcoming Consultations */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Upcoming Consultations</CardTitle>
                  <Link href="/dashboard/consultations">
                    <Button variant="ghost" size="sm">
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                <CardDescription>Your scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingConsultations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No upcoming consultations</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingConsultations.map((consultation: any) => (
                      <div key={consultation.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                        <Avatar>
                          <AvatarImage src={consultation.provider?.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback>{consultation.provider?.full_name?.charAt(0) || "D"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{consultation.provider?.full_name || "Doctor"}</p>
                          <p className="text-sm text-muted-foreground">
                            {consultation.scheduled_at
                              ? new Date(consultation.scheduled_at).toLocaleDateString()
                              : "Pending"}
                          </p>
                        </div>
                        <Badge variant={consultation.status === "accepted" ? "default" : "secondary"}>
                          {consultation.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Symptom Checks */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Health Checks</CardTitle>
                  <Link href="/check-symptoms">
                    <Button variant="ghost" size="sm">
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                <CardDescription>Your symptom history</CardDescription>
              </CardHeader>
              <CardContent>
                {recentSymptomChecks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Stethoscope className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No symptom checks yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentSymptomChecks.map((check) => (
                      <div key={check.id} className="p-3 rounded-lg bg-muted/50">
                        <div className="flex items-start justify-between mb-2">
                          <Badge
                            variant={
                              check.severity === "high"
                                ? "destructive"
                                : check.severity === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {check.severity}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(check.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{check.symptoms.slice(0, 3).join(", ")}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
