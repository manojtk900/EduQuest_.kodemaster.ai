import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Lightbulb, CheckCircle, XCircle, Star, ChevronRight, RefreshCw, Loader2 } from "lucide-react";
import { useCompleteMissionMutation } from "@/hooks/use-missions";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { QUIZ_CONTENT } from "@/data/mission-content";

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

export default function QuizView({ mission, onBack, onComplete }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const completeMission = useCompleteMissionMutation();

  const content = QUIZ_CONTENT[mission.id];
  const questions = content?.questions || [];
  const currentQuestion = questions[currentQ];
  const totalQuestions = questions.length;

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowResult(true);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selected];
    if (currentQ + 1 < totalQuestions) {
      setAnswers(newAnswers);
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      // Quiz finished — evaluate
      const allAnswers = [...newAnswers];
      const correct = allAnswers.filter((a, i) => a === questions[i].correct).length;
      const score = (correct / totalQuestions) * 100;
      setAnswers(allAnswers);
      setQuizDone(true);

      if (score >= 60) {
        completeMission.mutate(
          { missionId: mission.id },
          {
            onSuccess: (res) => {
              setXpEarned(res.xpAwarded);
              toast.success(<div className="flex flex-col gap-1"><span className="font-bold">Quiz Passed! 🎉</span><span>Score: {score.toFixed(0)}% — +{res.xpAwarded} XP!</span></div>);
              confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
              if (res.leveledUp) setTimeout(() => toast.success(`🚀 LEVEL UP! You're now a ${res.levelName}!`, { duration: 6000 }), 1000);
              if (res.badgesUnlocked?.length > 0) res.badgesUnlocked.forEach(b => setTimeout(() => toast(`🏆 Badge: ${b}`), 2000));
              setTimeout(onComplete, 2000);
            },
            onError: (err) => toast.error(err.message || "Failed to save quiz result"),
          }
        );
      } else {
        toast.error(`Score: ${score.toFixed(0)}% — You need 60% to pass. Try again!`);
      }
    }
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setSelected(null);
    setAnswers([]);
    setShowResult(false);
    setQuizDone(false);
    setXpEarned(0);
  };

  if (!content) {
    return (
      <div className="max-w-3xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-white mb-6 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Missions
        </button>
        <div className="glass-panel rounded-2xl p-12 text-center text-muted-foreground">
          <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="text-xl font-bold">Quiz content coming soon!</p>
        </div>
      </div>
    );
  }

  const correctCount = answers.filter((a, i) => a === questions[i]?.correct).length;
  const scorePercent = quizDone ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const passed = scorePercent >= 60;

  if (quizDone) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-6">
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-white group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Missions
        </button>
        <div className="glass-panel rounded-2xl p-8 text-center space-y-6">
          <div className={`text-6xl font-black ${passed ? "text-green-400" : "text-destructive"}`}>
            {scorePercent}%
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {passed ? "🎉 Quiz Passed!" : "😅 Almost There!"}
            </h2>
            <p className="text-muted-foreground">
              {correctCount} out of {totalQuestions} correct • {passed ? `+${xpEarned} XP earned!` : "Need 60% to pass"}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 text-left">
            {questions.map((q, i) => {
              const isCorrect = answers[i] === q.correct;
              return (
                <div key={i} className={`p-4 rounded-xl border text-sm ${isCorrect ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5"}`}>
                  <div className="flex items-start gap-2">
                    {isCorrect ? <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                    <div>
                      <p className="text-white font-medium">{q.question}</p>
                      {!isCorrect && <p className="text-green-400 text-xs mt-1">✓ Correct: {q.options[q.correct]}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {!passed && (
            <button onClick={handleRetry} className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all">
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          )}
          {completeMission.isPending && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl mx-auto space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-white group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Missions
      </button>

      <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 uppercase">
                <Lightbulb className="w-3.5 h-3.5" /> Quiz
              </span>
            </div>
            <h1 className="text-2xl font-display font-black text-white">{mission.title}</h1>
          </div>
          <div className="flex items-center gap-1.5 text-accent font-black">
            <Star className="w-5 h-5 fill-current" /> {mission.xpReward} XP
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQ + 1} of {totalQuestions}</span>
            <span>{Math.round(((currentQ) / totalQuestions) * 100)}% Complete</span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
              animate={{ width: `${((currentQ) / totalQuestions) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-white leading-relaxed">{currentQuestion?.question}</h2>
            <div className="grid gap-3">
              {currentQuestion?.options.map((option, idx) => {
                let btnClass = "w-full p-4 rounded-xl border text-left font-medium transition-all duration-200 ";
                if (!showResult) {
                  btnClass += "border-white/10 bg-white/5 hover:border-primary/50 hover:bg-primary/5 text-foreground cursor-pointer";
                } else if (idx === currentQuestion.correct) {
                  btnClass += "border-green-500 bg-green-500/10 text-green-400";
                } else if (idx === selected && idx !== currentQuestion.correct) {
                  btnClass += "border-red-500 bg-red-500/10 text-red-400";
                } else {
                  btnClass += "border-white/5 bg-white/[0.02] text-muted-foreground cursor-not-allowed";
                }

                return (
                  <motion.button
                    key={idx}
                    whileHover={!showResult ? { scale: 1.01 } : {}}
                    whileTap={!showResult ? { scale: 0.99 } : {}}
                    onClick={() => handleSelect(idx)}
                    className={btnClass}
                    disabled={showResult}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full border border-current flex items-center justify-center text-xs font-black shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {option}
                      {showResult && idx === currentQuestion.correct && <CheckCircle className="w-4 h-4 ml-auto shrink-0" />}
                      {showResult && idx === selected && idx !== currentQuestion.correct && <XCircle className="w-4 h-4 ml-auto shrink-0" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {showResult && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <button
              onClick={handleNext}
              className="w-full py-3 px-6 rounded-xl font-bold bg-primary text-white hover:bg-primary/90 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {currentQ + 1 < totalQuestions ? (
                <>Next Question <ChevronRight className="w-4 h-4" /></>
              ) : (
                <>Submit Quiz <CheckCircle className="w-4 h-4" /></>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
