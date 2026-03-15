import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, missionsTable, userMissionsTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middlewares/auth.js";
import { getLevelForXp, getXpToNextLevel, getLevelProgressPercent, checkBadges } from "../lib/gamification.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const allMissions = await db.select().from(missionsTable);
    const completedMissions = await db.select().from(userMissionsTable).where(eq(userMissionsTable.userId, req.userId!));
    const completedIds = new Set(completedMissions.map(m => m.missionId));

    const missions = allMissions.map(m => ({
      id: m.id,
      title: m.title,
      description: m.description,
      type: m.type,
      xpReward: m.xpReward,
      completed: completedIds.has(m.id),
      category: m.category,
      difficulty: m.difficulty,
    }));

    res.json(missions);
  } catch (err) {
    console.error("Get missions error:", err);
    res.status(500).json({ error: "Internal Server Error", message: "Failed to get missions" });
  }
});

router.post("/:missionId/complete", requireAuth, async (req: AuthRequest, res) => {
  const missionId = parseInt(req.params.missionId);
  if (isNaN(missionId)) {
    res.status(400).json({ error: "Bad Request", message: "Invalid mission ID" });
    return;
  }

  try {
    const [mission] = await db.select().from(missionsTable).where(eq(missionsTable.id, missionId)).limit(1);
    if (!mission) {
      res.status(400).json({ error: "Bad Request", message: "Mission not found" });
      return;
    }

    const existing = await db.select().from(userMissionsTable).where(
      and(eq(userMissionsTable.userId, req.userId!), eq(userMissionsTable.missionId, missionId))
    ).limit(1);

    if (existing.length > 0) {
      res.status(400).json({ error: "Bad Request", message: "Mission already completed" });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user) {
      res.status(401).json({ error: "Unauthorized", message: "User not found" });
      return;
    }

    await db.insert(userMissionsTable).values({
      userId: user.id,
      missionId,
      completedAt: new Date().toISOString(),
    });

    const newXp = user.xp + mission.xpReward;
    const oldLevel = getLevelForXp(user.xp);
    const newLevelInfo = getLevelForXp(newXp);
    const leveledUp = newLevelInfo.level > oldLevel.level;

    const allCompleted = await db.select().from(userMissionsTable).where(eq(userMissionsTable.userId, user.id));
    const allMissions = await db.select().from(missionsTable);
    const completedIds = new Set(allCompleted.map(m => m.missionId));
    const completedQuizzes = allMissions.filter(m => m.type === "quiz" && completedIds.has(m.id)).length;
    const completedAI = allMissions.filter(m => m.category === "AI" && completedIds.has(m.id)).length;
    const currentBadges = JSON.parse(user.badges || "[]");
    const newBadges = checkBadges(currentBadges, completedQuizzes, allCompleted.length, completedAI, user.streak);
    const allBadges = [...currentBadges, ...newBadges];

    await db.update(usersTable).set({
      xp: newXp,
      level: newLevelInfo.level,
      badges: JSON.stringify(allBadges),
    }).where(eq(usersTable.id, user.id));

    res.json({
      xpAwarded: mission.xpReward,
      newXp,
      newLevel: newLevelInfo.level,
      levelName: newLevelInfo.name,
      leveledUp,
      badgesUnlocked: newBadges,
      message: `Mission complete! +${mission.xpReward} XP earned! ${leveledUp ? `🎉 Level Up! You're now a ${newLevelInfo.name}!` : ""}`,
    });
  } catch (err) {
    console.error("Complete mission error:", err);
    res.status(500).json({ error: "Internal Server Error", message: "Failed to complete mission" });
  }
});

export default router;
