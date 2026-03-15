import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { LayoutDashboard, Target, Trophy, User, LogOut, Flame, Sparkles } from "lucide-react";
import { useUserQuery, useLogout } from "@/hooks/use-user"; // Wait, useLogout is in use-auth. Let's fix that import
import { useLogout as useAuthLogout } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { data: user, isLoading } = useUserQuery();
  const logout = useAuthLogout();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/missions", label: "Missions", icon: Target },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/profile", label: "Profile", icon: User },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Sparkles className="w-12 h-12 text-primary animate-pulse" />
      </div>
    );
  }

  // Redirect if not authed
  if (!user && location !== "/login" && location !== "/signup") {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans">
      {/* Sidebar Desktop / Bottom bar Mobile */}
      <nav className="fixed bottom-0 w-full md:w-72 md:relative md:h-screen glass-panel z-50 flex flex-col justify-between">
        <div className="p-6 hidden md:block">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl gamified-gradient flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-display font-black tracking-tight text-glow">EduQuest</h1>
          </Link>
        </div>

        <div className="flex-1 flex md:flex-col gap-2 p-4 md:p-6 justify-around md:justify-start">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 relative group",
                  isActive 
                    ? "bg-primary/10 text-primary neon-border" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute inset-0 bg-primary/10 rounded-2xl -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={cn("w-6 h-6", isActive && "drop-shadow-[0_0_8px_rgba(188,30,255,0.8)]")} />
                <span className="font-semibold hidden md:block">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {user && (
          <div className="hidden md:block p-6 border-t border-white/5">
            <div className="bg-black/40 rounded-2xl p-4 mb-4 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-muted-foreground">Lvl {user.level}</span>
                <div className="flex items-center gap-1 text-accent">
                  <Flame className="w-4 h-4 fill-current" />
                  <span className="text-sm font-bold">{user.streak}</span>
                </div>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-out"
                  style={{ width: `${user.progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-right">{user.xpToNextLevel} XP to go</p>
            </div>
            
            <button 
              onClick={logout}
              className="flex items-center gap-4 px-4 py-3 w-full rounded-2xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors group"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Log Out</span>
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto pb-24 md:pb-0">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
