import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import usersRouter from "./users.js";
import missionsRouter from "./missions.js";
import leaderboardRouter from "./leaderboard.js";
import recommendationsRouter from "./recommendations.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/missions", missionsRouter);
router.use("/leaderboard", leaderboardRouter);
router.use("/recommendations", recommendationsRouter);

export default router;
