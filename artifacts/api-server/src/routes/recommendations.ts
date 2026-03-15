import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middlewares/auth.js";
import { getRecommendations } from "../lib/gamification.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user) {
      res.status(401).json({ error: "Unauthorized", message: "User not found" });
      return;
    }
    const recs = getRecommendations(user.xp);
    res.json(recs);
  } catch (err) {
    console.error("Recommendations error:", err);
    res.status(500).json({ error: "Internal Server Error", message: "Failed to get recommendations" });
  }
});

export default router;
