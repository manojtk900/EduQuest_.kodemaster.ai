import { useState } from "react";
import { useMissionsQuery } from "@/hooks/use-missions";
import { motion, AnimatePresence } from "framer-motion";
import { Play, CheckCircle, Star, Filter, BookOpen, PenTool, Lightbulb, Target } from "lucide-react";
import LessonView from "./lesson-view";
import QuizView from "./quiz-view";
import CodingView from "./coding-view";

type MissionView = "list" | "lesson" | "quiz" | "coding";

type SelectedMission = {
  id: number;
  title: string;
  description: string;
  xpReward: number;
  category: string;
  difficulty: string;
  type: string;
  completed: boolean;
};

export default function Missions() {
  const { data: missions, isLoading, refetch } = useMissionsQuery();
  const [filterType, setFilterType] = useState<string>("all");
  const [view, setView] = useState<MissionView>("list");
  const [selectedMission, setSelectedMission] = useState<SelectedMission | null>(null);

  const handleStartMission = (mission: SelectedMission) => {
    setSelectedMission(mission);
    if (mission.type === "lesson") setView("lesson");
    else if (mission.type === "quiz") setView("quiz");
    else if (mission.type === "project") setView("coding");
  };

  const handleBack = () => {
    setView("list");
    setSelectedMission(null);
  };

  const handleComplete = () => {
    refetch();
    setView("list");
    setSelectedMission(null);
  };

  if (view === "lesson" && selectedMission) {
    return <LessonView mission={selectedMission} onBack={handleBack} onComplete={handleComplete} />;
  }
  if (view === "quiz" && selectedMission) {
    return <QuizView mission={selectedMission} onBack={handleBack} onComplete={handleComplete} />;
  }
  if (view === "coding" && selectedMission) {
    return <CodingView mission={selectedMission} onBack={handleBack} onComplete={handleComplete} />;
  }

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

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'lesson': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'quiz': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'project': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      default: return 'text-muted-foreground bg-white/5 border-white/10';
    }
  };

  const getActionLabel = (type: string) => {
    switch(type) {
      case 'lesson': return 'Watch Lesson';
      case 'quiz': return 'Take Quiz';
      case 'project': return 'Start Coding';
      default: return 'Start';
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
          {[
            { value: 'all', label: 'All' },
            { value: 'lesson', label: 'Lesson' },
            { value: 'quiz', label: 'Quiz' },
            { value: 'project', label: 'Project' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilterType(value)}
              className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                filterType === value
                  ? 'bg-primary text-white shadow-md'
                  : 'text-muted-foreground hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
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
              className={`glass-panel rounded-2xl overflow-hidden flex flex-col relative group transition-all duration-300 ${
                mission.completed ? 'opacity-70' : 'hover:-translate-y-1 hover:shadow-2xl cursor-pointer'
              }`}
            >
              {mission.completed && (
                <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 p-1.5 rounded-full z-10 backdrop-blur-md">
                  <CheckCircle className="w-6 h-6" />
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border flex items-center gap-1 ${getTypeColor(mission.type)}`}>
                    {getTypeIcon(mission.type)} {mission.type}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border ${getDifficultyColor(mission.difficulty)}`}>
                    {mission.difficulty}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{mission.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">{mission.description}</p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-accent font-black">
                    <Star className="w-5 h-5 fill-current" /> {mission.xpReward} XP
                  </div>

                  <button
                    onClick={() => !mission.completed && handleStartMission(mission as SelectedMission)}
                    disabled={mission.completed}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
                      mission.completed
                        ? 'bg-white/5 text-muted-foreground cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(188,30,255,0.4)] active:scale-95'
                    }`}
                  >
                    {mission.completed ? (
                      'Completed'
                    ) : (
                      <>{getActionLabel(mission.type)} <Play className="w-4 h-4" /></>
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
