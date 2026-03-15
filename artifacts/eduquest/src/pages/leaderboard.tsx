import { useLeaderboardQuery } from "@/hooks/use-leaderboard";
import { useUserQuery } from "@/hooks/use-user";
import { Trophy, Medal, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = useLeaderboardQuery();
  const { data: me } = useUserQuery();

  if (isLoading) return <div className="text-center py-20 text-muted-foreground font-bold">Loading leaderboard...</div>;

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/5 border-yellow-500/30 text-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.15)]";
      case 2: return "bg-gradient-to-r from-gray-300/20 to-gray-400/5 border-gray-300/30 text-gray-300 shadow-[0_0_20px_rgba(209,213,219,0.1)]";
      case 3: return "bg-gradient-to-r from-amber-700/20 to-amber-800/5 border-amber-700/30 text-amber-600 shadow-[0_0_20px_rgba(180,83,9,0.1)]";
      default: return "bg-card border-white/5 text-muted-foreground";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-8 h-8 text-yellow-500 fill-yellow-500/20" />;
      case 2: return <Medal className="w-8 h-8 text-gray-300 fill-gray-300/20" />;
      case 3: return <Medal className="w-8 h-8 text-amber-600 fill-amber-700/20" />;
      default: return <span className="text-xl font-black w-8 text-center">{rank}</span>;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
          <Trophy className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4">Global Leaderboard</h1>
        <p className="text-muted-foreground text-lg">Top scholars climbing the ranks. Will you be #1?</p>
      </div>

      <div className="space-y-3">
        {leaderboard?.map((entry, idx) => {
          const isMe = me?.id === entry.userId;
          
          return (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={entry.userId}
              className={`flex items-center gap-4 p-4 md:p-6 rounded-2xl border backdrop-blur-md transition-all ${getRankStyle(entry.rank)} ${isMe ? 'ring-2 ring-primary/50' : ''}`}
            >
              <div className="flex items-center justify-center w-12 h-12 shrink-0">
                {getRankIcon(entry.rank)}
              </div>
              
              <div className="w-12 h-12 rounded-full overflow-hidden bg-black/50 border border-white/10 shrink-0">
                 <img 
                   src={`${import.meta.env.BASE_URL}images/avatar-placeholder.png`} 
                   alt="Avatar" 
                   className="w-full h-full object-cover opacity-80"
                 />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={`text-xl font-bold truncate ${isMe ? 'text-primary text-glow' : 'text-foreground'}`}>
                    {entry.username} {isMe && "(You)"}
                  </h3>
                  {entry.badges.length > 0 && (
                    <div className="hidden sm:flex items-center bg-white/5 rounded-full px-2 py-0.5 border border-white/10 gap-1" title={`${entry.badges.length} Badges`}>
                      <Shield className="w-3 h-3 text-secondary" />
                      <span className="text-xs font-bold text-muted-foreground">{entry.badges.length}</span>
                    </div>
                  )}
                </div>
                <div className="text-sm font-semibold opacity-70">
                  Level {entry.level} • {entry.levelName}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-2xl font-black text-accent">{entry.xp.toLocaleString()}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">XP</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
