import { useEffect } from "react";
import { useUserQuery, useDailyLoginMutation } from "@/hooks/use-user";
import { useRecommendationsQuery } from "@/hooks/use-recommendations";
import { Flame, Star, Target, Zap, ChevronRight, Award } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: user } = useUserQuery();
  const { data: recommendations } = useRecommendationsQuery();
  const dailyLogin = useDailyLoginMutation();

  useEffect(() => {
    // Attempt daily login on mount
    dailyLogin.mutate(undefined, {
      onSuccess: (res) => {
        if (!res.alreadyClaimed) {
          toast.success(
            <div className="flex flex-col gap-1">
              <span className="font-bold text-lg flex items-center gap-2">
                <Star className="text-accent fill-accent w-5 h-5" /> Daily Reward Claimed!
              </span>
              <span>+{res.xpAwarded} XP • Streak: {res.newStreak} 🔥</span>
            </div>,
            { duration: 4000 }
          );
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-white">
            Welcome back, <span className="text-transparent bg-clip-text gamified-gradient">{user.username}</span>! 🎮
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Ready to level up your skills today?</p>
        </div>
        <div className="flex items-center gap-3 bg-card border border-white/5 px-5 py-3 rounded-2xl shadow-lg">
          <Flame className="w-6 h-6 text-accent fill-accent animate-pulse" />
          <div>
            <div className="text-sm text-muted-foreground font-semibold">Current Streak</div>
            <div className="text-xl font-black text-white">{user.streak} Days</div>
          </div>
        </div>
      </header>

      {/* Hero Stats Card */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative overflow-hidden rounded-3xl p-1 shadow-2xl gamified-gradient"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="bg-background/95 backdrop-blur-xl rounded-[1.3rem] p-6 md:p-8 relative z-10 flex flex-col md:flex-row items-center gap-8">
          
          <div className="w-32 h-32 shrink-0 relative">
            <img 
              src={`${import.meta.env.BASE_URL}images/avatar-placeholder.png`} 
              alt="Avatar"
              className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(188,30,255,0.5)]"
            />
            <div className="absolute -bottom-2 -right-2 bg-black border-2 border-primary w-10 h-10 rounded-full flex items-center justify-center font-black text-lg">
              {user.level}
            </div>
          </div>

          <div className="flex-1 w-full space-y-4 text-center md:text-left">
            <div>
              <h2 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-2">
                <Award className="w-6 h-6 text-primary" /> {user.levelName}
              </h2>
              <div className="flex items-center justify-between mt-4 mb-2">
                <span className="font-bold text-accent">{user.xp} XP</span>
                <span className="text-sm text-muted-foreground font-semibold">{user.xpToNextLevel} to Level {user.level + 1}</span>
              </div>
              <div className="h-4 w-full bg-black/50 rounded-full overflow-hidden border border-white/10 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${user.progressPercent}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  className="h-full gamified-gradient relative"
                >
                  <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}></div>
                </motion.div>
              </div>
            </div>
          </div>

        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-display font-bold flex items-center gap-2">
              <Zap className="w-6 h-6 text-secondary" /> AI Recommended Next Steps
            </h3>
            <Link href="/missions" className="text-sm font-bold text-primary hover:text-primary/80 flex items-center">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          {recommendations?.nextCourses.map((course, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel p-6 rounded-2xl hover:-translate-y-1 hover:shadow-primary/10 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs font-bold px-2 py-1 rounded-md bg-secondary/10 text-secondary uppercase tracking-wider border border-secondary/20">
                      {course.difficulty}
                    </span>
                    {course.tags.map(tag => (
                      <span key={tag} className="text-xs font-bold px-2 py-1 rounded-md bg-white/5 text-muted-foreground uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h4 className="text-xl font-bold group-hover:text-secondary transition-colors">{course.title}</h4>
                  <p className="text-muted-foreground mt-2 line-clamp-2">{course.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="bg-accent/10 text-accent border border-accent/20 px-3 py-2 rounded-xl font-black flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" /> +{course.estimatedXp} XP
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats side */}
        <div className="space-y-6">
          <h3 className="text-2xl font-display font-bold flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" /> Quick Stats
          </h3>
          
          <div className="glass-panel rounded-2xl p-6 space-y-6">
            <div>
              <div className="text-sm text-muted-foreground font-semibold mb-1">Missions Completed</div>
              <div className="text-3xl font-black text-white">{user.completedMissions.length}</div>
            </div>
            
            <div className="h-px w-full bg-white/5"></div>
            
            <div>
              <div className="text-sm text-muted-foreground font-semibold mb-1">Total Badges</div>
              <div className="text-3xl font-black text-white">{user.badges.length}</div>
              <div className="flex flex-wrap gap-2 mt-3">
                {user.badges.slice(0, 3).map((badge, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center" title={badge}>
                    <Award className="w-5 h-5 text-accent" />
                  </div>
                ))}
                {user.badges.length > 3 && (
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-muted-foreground">
                    +{user.badges.length - 3}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
