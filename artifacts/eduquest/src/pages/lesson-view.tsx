import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, CheckCircle, Star, Loader2 } from "lucide-react";
import { useCompleteMissionMutation } from "@/hooks/use-missions";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { LESSON_CONTENT } from "@/data/mission-content";

type Mission = {
  id: number;
  title: string;
  description: string;
  xpReward: number;
  category: string;
  difficulty: string;
};

type Props = {
  mission: Mission;
  onBack: () => void;
  onComplete: () => void;
};

export default function LessonView({ mission, onBack, onComplete }: Props) {
  const [completed, setCompleted] = useState(false);
  const completeMission = useCompleteMissionMutation();
  const content = LESSON_CONTENT[mission.id];

  const handleComplete = () => {
    if (completed) return;
    completeMission.mutate(
      { missionId: mission.id },
      {
        onSuccess: (res) => {
          setCompleted(true);
          toast.success(
            <div className="flex flex-col gap-1">
              <span className="font-bold text-lg">Lesson Complete! 📚</span>
              <span>+{res.xpAwarded} XP earned!</span>
            </div>
          );
          if (res.leveledUp) {
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ["#bc1eff", "#00d4ff", "#ffeb3b"] });
            setTimeout(() => toast.success(`🚀 LEVEL UP! You're now a ${res.levelName}!`, { duration: 6000 }), 1000);
          }
          if (res.badgesUnlocked?.length > 0) {
            res.badgesUnlocked.forEach((badge) =>
              setTimeout(() => toast(`🏆 Badge Unlocked: ${badge}`), 2000)
            );
          }
          setTimeout(onComplete, 1500);
        },
        onError: (err) => toast.error(err.message || "Failed to complete lesson"),
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Missions
      </button>

      <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                <BookOpen className="w-3.5 h-3.5" /> Lesson
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/5 text-muted-foreground border border-white/10 uppercase">
                {mission.difficulty}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/5 text-muted-foreground border border-white/10">
                {mission.category}
              </span>
            </div>
            <h1 className="text-3xl font-display font-black text-white">{mission.title}</h1>
            <p className="text-muted-foreground mt-2">{mission.description}</p>
          </div>
          <div className="shrink-0 flex items-center gap-1.5 text-accent font-black text-xl">
            <Star className="w-5 h-5 fill-current" /> {mission.xpReward} XP
          </div>
        </div>

        {/* YouTube Video */}
        {content?.youtubeId ? (
          <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${content.youtubeId}?rel=0&modestbranding=1`}
                title={mission.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-white/5 border border-white/10 p-8 text-center text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Video content loading...</p>
          </div>
        )}

        {/* Lesson Explanation */}
        {content?.explanation && (
          <div className="bg-black/30 rounded-xl border border-white/5 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" /> Lesson Notes
            </h3>
            <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm">
              {content.explanation}
            </div>
          </div>
        )}

        {/* Complete Button */}
        <div className="pt-2">
          {completed ? (
            <div className="flex items-center justify-center gap-3 py-4 px-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 font-bold text-lg">
              <CheckCircle className="w-6 h-6" /> Lesson Completed! +{mission.xpReward} XP
            </div>
          ) : (
            <button
              onClick={handleComplete}
              disabled={completeMission.isPending}
              className="w-full py-4 px-6 rounded-2xl font-bold text-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg hover:shadow-blue-500/20 active:scale-95"
            >
              {completeMission.isPending ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Saving Progress...</>
              ) : (
                <><CheckCircle className="w-5 h-5" /> Mark Lesson Complete (+{mission.xpReward} XP)</>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
