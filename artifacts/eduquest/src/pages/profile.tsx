import { useUserQuery } from "@/hooks/use-user";
import { format, subDays } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Award, Flame, Target, Zap, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function Profile() {
  const { data: user, isLoading } = useUserQuery();

  if (isLoading || !user) return null;

  // Generate fake history data bridging 7 days ending in current XP
  const historyData = Array.from({ length: 7 }).map((_, i) => {
    const daysAgo = 6 - i;
    const date = subDays(new Date(), daysAgo);
    // Fake linear growth backwards
    const historicalXp = Math.max(0, user.xp - (daysAgo * 120) + (Math.random() * 50 - 25));
    return {
      date: format(date, "MMM dd"),
      xp: Math.round(daysAgo === 0 ? user.xp : historicalXp),
    };
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="glass-panel rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-40 h-40 relative group">
            <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
            <img 
              src={`${import.meta.env.BASE_URL}images/avatar-placeholder.png`} 
              alt="Avatar"
              className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-bold tracking-widest uppercase text-muted-foreground mb-2">
              Scholar Profile
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black text-white text-glow">{user.username}</h1>
            <p className="text-xl text-secondary font-bold flex items-center justify-center md:justify-start gap-2">
              <Zap className="w-5 h-5 fill-current" /> {user.levelName} (Lvl {user.level})
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 text-accent flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="text-sm font-bold text-muted-foreground uppercase">Total XP</div>
              <div className="text-2xl font-black text-white">{user.xp.toLocaleString()}</div>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-500 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="text-sm font-bold text-muted-foreground uppercase">Current Streak</div>
              <div className="text-2xl font-black text-white">{user.streak} Days</div>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-muted-foreground uppercase">Missions Done</div>
              <div className="text-2xl font-black text-white">{user.completedMissions.length}</div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="md:col-span-2 glass-panel p-6 rounded-2xl flex flex-col">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-primary" /> XP Growth (7 Days)
          </h3>
          <div className="flex-1 w-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  hide={true} 
                  domain={['dataMin - 100', 'dataMax + 100']} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px', fontWeight: 'bold' }}
                  itemStyle={{ color: 'hsl(var(--primary))' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="xp" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorXp)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="glass-panel p-8 rounded-3xl">
        <h3 className="text-2xl font-display font-bold flex items-center gap-2 mb-8">
          <Award className="w-6 h-6 text-accent" /> Achievement Badges
        </h3>
        {user.badges.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground border-2 border-dashed border-white/5 rounded-2xl">
            <Award className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-bold">No badges yet. Complete missions to earn some!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {user.badges.map((badge, idx) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
                className="bg-black/30 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/5 transition-colors group cursor-default"
              >
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-accent/20 to-orange-500/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(234,179,8,0)] group-hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                  <Award className="w-8 h-8 text-accent fill-accent/50" />
                </div>
                <h4 className="font-bold text-sm leading-tight">{badge}</h4>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
