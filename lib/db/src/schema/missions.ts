import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const missionsTable = pgTable("missions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  xpReward: integer("xp_reward").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
});

export const userMissionsTable = pgTable("user_missions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  missionId: integer("mission_id").notNull(),
  completedAt: text("completed_at").notNull(),
});

export const insertMissionSchema = createInsertSchema(missionsTable).omit({ id: true });
export const insertUserMissionSchema = createInsertSchema(userMissionsTable).omit({ id: true });
export type InsertMission = z.infer<typeof insertMissionSchema>;
export type Mission = typeof missionsTable.$inferSelect;
export type UserMission = typeof userMissionsTable.$inferSelect;
