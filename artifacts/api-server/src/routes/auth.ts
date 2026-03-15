import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { createToken, hashPassword } from "../lib/auth.js";
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

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Bad Request", message: "Username and password are required" });
    return;
  }
  try {
    const existing = await db.select().from(usersTable).where(eq(usersTable.username, username)).limit(1);
    if (existing.length > 0) {
      res.status(400).json({ error: "Bad Request", message: "Username already taken" });
      return;
    }
    const [user] = await db.insert(usersTable).values({
      username,
      password: hashPassword(password),
      xp: 0,
      level: 1,
      streak: 0,
      badges: "[]",
    }).returning();
    const token = createToken(user.id, user.username);
    res.status(201).json({ token, user: buildUserProfile(user) });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal Server Error", message: "Failed to create user" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Bad Request", message: "Username and password are required" });
    return;
  }
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.username, username)).limit(1);
    if (!user || user.password !== hashPassword(password)) {
      res.status(401).json({ error: "Unauthorized", message: "Invalid credentials" });
      return;
    }
    const token = createToken(user.id, user.username);
    res.json({ token, user: buildUserProfile(user) });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal Server Error", message: "Failed to login" });
  }
});

export { buildUserProfile };
export default router;
