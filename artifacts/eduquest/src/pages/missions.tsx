import { useState } from "react";
import { useMissionsQuery, useCompleteMissionMutation } from "@/hooks/use-missions";
import { motion, AnimatePresence } from "framer-motion";
import { Play, CheckCircle, Star, Filter, BookOpen, PenTool, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export default function Missions() {
  const { data: missions, isLoading } = useMissionsQuery();
  const completeMission = useCompleteMissionMutation();
  const [filterType, setFilterType] = useState<string>("all");

  const handleStartMission = (missionId: number) => {
    completeMission.mutate(
      { missionId },
      {
        onSuccess: (res) => {
          toast.success(
            <div className="flex flex-col gap-1">
              <span className="font-bold text-lg text-accent flex items-center gap-2">
                Mission Complete!
              </span>
              <span>You earned +{res.xpAwarded} XP! 🌟</span>
            </div>
          );

          if (res.leveledUp) {
            confetti({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#bc1eff', '#00d4ff', '#ffeb3b']
            });
            setTimeout(() => {
              toast.success(
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-xl text-primary text-glow">LEVEL UP! 🚀</span>
                  <span>You are now a {res.levelName}!</span>
                </div>,
                { duration: 6000 }
              );
            }, 1000);
          }
          
          if (res.badgesUnlocked?.length > 0) {
            res.badgesUnlocked.forEach(badge => {
              setTimeout(() => {
                toast("🏆 New Badge Unlocked!", {
                  description: badge,
                  className: "border-accent text-accent"
                });
              }, 2000);
            });
          }
        },
        onError: (err) => {
          toast.error(err.message || "Failed to complete mission");
        }
      }
    );
  };

  const filteredMissions = missions?.filter(m => filterType === "all" || m.type === filterType) || [];

  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'beginner': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'intermediate': return 'text-secondary bg-secondary/10 border-secondary/20';
      case 'advanced': return 'text-destructive bg-destructive/10 border-destructive/20';
      default: return 'text-muted-foreground bg-white/5 border-white/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'lesson': return <BookOpen className="w-4 h-4" />;
      case 'quiz': return <Lightbulb className="w-4 h-4" />;
      case 'project': return <PenTool className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  if (isLoading) return <div className="text-center py-20 text-muted-foreground font-bold">Loading missions...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-display font-black text-white">Missions Hub 🎯</h1>
          <p className="text-muted-foreground mt-2 text-lg">Complete tasks to earn XP and level up.</p>
        </div>

        <div className="flex items-center gap-2 bg-card border border-white/5 p-1 rounded-xl shadow-lg">
          <Filter className="w-4 h-4 text-muted-foreground ml-2" />
          {['all', 'lesson', 'quiz', 'project'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                filterType === type 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-muted-foreground hover:text-white hover:bg-white/5'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredMissions.map((mission, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              key={mission.id}
              className={`glass-panel rounded-2xl overflow-hidden flex flex-col relative group ${mission.completed ? 'opacity-70' : 'hover:-translate-y-1 hover:shadow-2xl'}`}
            >
              {mission.completed && (
                <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 p-1.5 rounded-full z-10 backdrop-blur-md">
                  <CheckCircle className="w-6 h-6" />
                </div>
              )}
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border ${getDifficultyColor(mission.difficulty)}`}>
                    {mission.difficulty}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/5 text-muted-foreground uppercase tracking-wider border border-white/10 flex items-center gap-1">
                    {getTypeIcon(mission.type)} {mission.type}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{mission.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">{mission.description}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-accent font-black">
                    <Star className="w-5 h-5 fill-current" /> {mission.xpReward} XP
                  </div>
                  
                  <button
                    onClick={() => handleStartMission(mission.id)}
                    disabled={mission.completed || completeMission.isPending}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
                      mission.completed
                        ? 'bg-white/5 text-muted-foreground cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(188,30,255,0.4)] active:scale-95'
                    }`}
                  >
                    {mission.completed ? (
                      'Completed'
                    ) : completeMission.isPending ? (
                      'Processing...'
                    ) : (
                      <>Start <Play className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredMissions.length === 0 && (
          <div className="col-span-full text-center py-20 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-xl font-bold">No missions found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
