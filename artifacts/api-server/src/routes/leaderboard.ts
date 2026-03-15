import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth.js";
import { getLevelForXp } from "../lib/gamification.js";

const router = Router();

router.get("/", requireAuth, async (_req, res) => {
  try {
    const users = await db.select().from(usersTable).orderBy(desc(usersTable.xp)).limit(20);
    const leaderboard = users.map((user, idx) => {
      const levelInfo = getLevelForXp(user.xp);
      const badges = JSON.parse(user.badges || "[]");
      return {
        rank: idx + 1,
        userId: user.id,
        username: user.username,
        xp: user.xp,
        level: levelInfo.level,
        levelName: levelInfo.name,
        badges,
      };
    });
    res.json(leaderboard);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ error: "Internal Server Error", message: "Failed to get leaderboard" });
  }
});

export default router;
