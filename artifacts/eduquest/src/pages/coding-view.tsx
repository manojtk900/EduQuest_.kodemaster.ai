import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, PenTool, CheckCircle, Star, Play, Loader2, Lightbulb, Terminal } from "lucide-react";
import { useCompleteMissionMutation } from "@/hooks/use-missions";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { CODING_CONTENT } from "@/data/mission-content";

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

export default function CodingView({ mission, onBack, onComplete }: Props) {
  const content = CODING_CONTENT[mission.id];
  const [code, setCode] = useState(content?.starterCode || "# Write your Python code here\n");
  const [output, setOutput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [running, setRunning] = useState(false);
  const completeMission = useCompleteMissionMutation();

  const handleRun = () => {
    setRunning(true);
    setOutput("");
    setTimeout(() => {
      setOutput(`▶ Running Python code...\n\n[Simulated Output]\n${content?.sampleOutput || "Code executed successfully!"}\n\n✓ No errors found. Looks good! Try submitting your solution.`);
      setRunning(false);
    }, 1500);
  };

  const handleSubmit = () => {
    if (submitted) return;
    completeMission.mutate(
      { missionId: mission.id },
      {
        onSuccess: (res) => {
          setSubmitted(true);
          setOutput(prev => prev + `\n\n✅ Solution submitted! +${res.xpAwarded} XP awarded!`);
          toast.success(
            <div className="flex flex-col gap-1">
              <span className="font-bold text-lg">Challenge Complete! 💻</span>
              <span>+{res.xpAwarded} XP earned!</span>
            </div>
          );
          confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ["#bc1eff", "#00d4ff", "#ffeb3b"] });
          if (res.leveledUp) setTimeout(() => toast.success(`🚀 LEVEL UP! You're now a ${res.levelName}!`, { duration: 6000 }), 1000);
          if (res.badgesUnlocked?.length > 0) res.badgesUnlocked.forEach(b => setTimeout(() => toast(`🏆 Badge: ${b}`), 2000));
          setTimeout(onComplete, 2500);
        },
        onError: (err) => toast.error(err.message || "Failed to submit solution"),
      }
    );
  };

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} className="max-w-5xl mx-auto space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-white group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Missions
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Statement */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase">
                <PenTool className="w-3.5 h-3.5" /> Project
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/5 text-muted-foreground border border-white/10 uppercase">
                {mission.difficulty}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-accent font-black">
              <Star className="w-5 h-5 fill-current" /> {mission.xpReward} XP
            </div>
          </div>

          <h1 className="text-2xl font-display font-black text-white">{mission.title}</h1>

          {content ? (
            <div className="prose prose-invert prose-sm max-w-none">
              <pre className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap font-sans bg-black/30 rounded-xl p-4 border border-white/5 overflow-y-auto max-h-80">
                {content.problem}
              </pre>
            </div>
          ) : (
            <p className="text-muted-foreground">{mission.description}</p>
          )}

          {content?.hint && (
            <div>
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                <Lightbulb className="w-4 h-4" />
                {showHint ? "Hide Hint" : "Show Hint"}
              </button>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10 text-sm text-yellow-300"
                >
                  💡 {content.hint}
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Code Editor */}
        <div className="space-y-4">
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-black/40 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-xs text-muted-foreground font-mono">solution.py</span>
              </div>
              <span className="text-xs text-muted-foreground">Python 3</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={submitted}
              className="w-full h-72 bg-black/60 text-green-300 font-mono text-sm p-4 resize-none focus:outline-none disabled:opacity-70 leading-relaxed"
              spellCheck={false}
              placeholder="# Write your Python code here..."
            />
          </div>

          {/* Output Terminal */}
          {output && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="glass-panel rounded-2xl overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-black/50 border-b border-white/5">
                <Terminal className="w-3.5 h-3.5 text-green-400" />
                <span className="text-xs text-muted-foreground font-mono">Output</span>
              </div>
              <pre className="p-4 text-xs font-mono text-green-300 bg-black/60 max-h-40 overflow-y-auto leading-relaxed whitespace-pre-wrap">
                {output}
              </pre>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleRun}
              disabled={running || submitted}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-white/10 hover:bg-white/15 border border-white/10 text-white transition-all disabled:opacity-50 active:scale-95"
            >
              {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current text-green-400" />}
              {running ? "Running..." : "Run Code"}
            </button>

            {submitted ? (
              <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-green-500/10 border border-green-500/20 text-green-400">
                <CheckCircle className="w-5 h-5" /> Submitted!
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={completeMission.isPending}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white transition-all disabled:opacity-50 active:scale-95 shadow-lg hover:shadow-orange-500/20"
              >
                {completeMission.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                {completeMission.isPending ? "Submitting..." : `Submit (+${mission.xpReward} XP)`}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
