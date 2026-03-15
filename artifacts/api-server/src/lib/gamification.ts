export const LEVELS = [
  { level: 1, name: "Beginner", minXp: 0, maxXp: 100 },
  { level: 2, name: "Explorer", minXp: 100, maxXp: 300 },
  { level: 3, name: "Hacker", minXp: 300, maxXp: 700 },
  { level: 4, name: "Master", minXp: 700, maxXp: Infinity },
];

export function getLevelForXp(xp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export function getXpToNextLevel(xp: number): number {
  const current = getLevelForXp(xp);
  if (current.maxXp === Infinity) return 0;
  return current.maxXp - xp;
}

export function getLevelProgressPercent(xp: number): number {
  const current = getLevelForXp(xp);
  if (current.maxXp === Infinity) return 100;
  const range = current.maxXp - current.minXp;
  const progress = xp - current.minXp;
  return Math.min(100, Math.round((progress / range) * 100));
}

export const BADGES = [
  { id: "quiz_master", name: "Quiz Master", condition: (completedQuizzes: number) => completedQuizzes >= 3 },
  { id: "fast_learner", name: "Fast Learner", condition: (_: number, totalMissions: number) => totalMissions >= 5 },
  { id: "ai_explorer", name: "AI Explorer", condition: (_: number, __: number, completedAI: number) => completedAI >= 1 },
];

export function checkBadges(
  currentBadges: string[],
  completedQuizzes: number,
  totalMissions: number,
  completedAI: number,
  streak: number
): string[] {
  const newBadges: string[] = [];
  if (completedQuizzes >= 3 && !currentBadges.includes("Quiz Master")) newBadges.push("Quiz Master");
  if (totalMissions >= 5 && !currentBadges.includes("Fast Learner")) newBadges.push("Fast Learner");
  if (completedAI >= 1 && !currentBadges.includes("AI Explorer")) newBadges.push("AI Explorer");
  if (streak >= 7 && !currentBadges.includes("7 Day Streak")) newBadges.push("7 Day Streak");
  return newBadges;
}

export function getRecommendations(xp: number) {
  if (xp < 100) {
    return {
      recommended: "Python Basics",
      reason: "Start with the fundamentals to build a strong foundation",
      nextCourses: [
        { title: "Python Basics", description: "Learn Python syntax, variables, loops, and functions", difficulty: "beginner", estimatedXp: 80, tags: ["python", "programming", "basics"] },
        { title: "Intro to Algorithms", description: "Understand basic algorithmic thinking and problem solving", difficulty: "beginner", estimatedXp: 60, tags: ["algorithms", "logic"] },
      ]
    };
  } else if (xp < 300) {
    return {
      recommended: "Data Structures",
      reason: "You've mastered the basics! Time to level up with data structures",
      nextCourses: [
        { title: "Data Structures Challenge", description: "Arrays, linked lists, stacks, queues, trees, and graphs", difficulty: "intermediate", estimatedXp: 150, tags: ["data-structures", "algorithms"] },
        { title: "Python Advanced", description: "OOP, decorators, generators, and advanced Python patterns", difficulty: "intermediate", estimatedXp: 120, tags: ["python", "oop", "advanced"] },
      ]
    };
  } else if (xp < 700) {
    return {
      recommended: "Machine Learning",
      reason: "You're a Hacker now! Machine Learning is within your reach",
      nextCourses: [
        { title: "Machine Learning Lesson", description: "Supervised learning, regression, classification with scikit-learn", difficulty: "intermediate", estimatedXp: 200, tags: ["ml", "scikit-learn", "statistics"] },
        { title: "Data Analysis with Pandas", description: "Data wrangling, visualization, and insights from real datasets", difficulty: "intermediate", estimatedXp: 180, tags: ["pandas", "data-analysis", "visualization"] },
      ]
    };
  } else {
    return {
      recommended: "Deep Learning",
      reason: "Master-level learner! Dive into the depths of neural networks",
      nextCourses: [
        { title: "Deep Learning & Neural Networks", description: "CNNs, RNNs, transformers, and modern AI architectures", difficulty: "advanced", estimatedXp: 300, tags: ["deep-learning", "pytorch", "tensorflow"] },
        { title: "AI Mini Project", description: "Build a complete AI system from scratch using real-world data", difficulty: "advanced", estimatedXp: 250, tags: ["ai", "project", "deployment"] },
      ]
    };
  }
}
