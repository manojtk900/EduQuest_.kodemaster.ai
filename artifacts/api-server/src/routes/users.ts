import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, userMissionsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middlewares/auth.js";
import { getLevelForXp, getXpToNextLevel, getLevelProgressPercent } from "../lib/gamification.js";

const router = Router();

function buildUserProfile(user: typeof usersTable.$inferSelect, completedMissions: number[] = []) {
  const levelInfo = getLevelForXp(user.xp);
  const badges = JSON.parse(user.badges || "[]");
  return {
    id: user.id,
    username: user.username,
    xp: user.xp,
    level: levelInfo.level,
    levelName: levelInfo.name,
    streak: user.streak,
    badges,
    xpToNextLevel: getXpToNextLevel(user.xp),
    progressPercent: getLevelProgressPercent(user.xp),
    completedMissions,
  };
}

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user) {
      res.status(401).json({ error: "Unauthorized", message: "User not found" });
      return;
    }
    const completedMissions = await db.select().from(userMissionsTable).where(eq(userMissionsTable.userId, user.id));
    const missionIds = completedMissions.map(m => m.missionId);
    res.json(buildUserProfile(user, missionIds));
  } catch (err) {
    console.error("Get me error:", err);
    res.status(500).json({ error: "Internal Server Error", message: "Failed to get user" });
  }
});

router.post("/daily-login", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user) {
      res.status(401).json({ error: "Unauthorized", message: "User not found" });
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (user.lastLoginDate === today) {
      res.json({ xpAwarded: 0, streakBonus: 0, newStreak: user.streak, message: "Already claimed today!", alreadyClaimed: true });
      return;
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const newStreak = user.lastLoginDate === yesterday ? user.streak + 1 : 1;

    let streakBonus = 0;
    if (newStreak === 3) streakBonus = 20;
    else if (newStreak >= 7) streakBonus = 50;

    const xpAwarded = 5;
    const totalXpGain = xpAwarded + streakBonus;
    const newXp = user.xp + totalXpGain;
    const newLevel = getLevelForXp(newXp).level;

    await db.update(usersTable).set({
      xp: newXp,
      level: newLevel,
      streak: newStreak,
      lastLoginDate: today,
    }).where(eq(usersTable.id, user.id));

    let message = `+${xpAwarded} XP for daily login!`;
    if (streakBonus > 0) message += ` 🔥 ${newStreak}-day streak bonus: +${streakBonus} XP!`;

    res.json({ xpAwarded, streakBonus, newStreak, message, alreadyClaimed: false });
  } catch (err) {
    console.error("Daily login error:", err);
    res.status(500).json({ error: "Internal Server Error", message: "Failed to record daily login" });
  }
});

export default router;
