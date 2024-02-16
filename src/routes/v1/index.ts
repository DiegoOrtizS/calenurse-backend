import { Router } from "express";
import scheduleRouter from "./schedule";
import desiredScheduleRouter from "./desired-schedule";
import authRouter from "./auth";

const router = Router();

router.use("/schedule", scheduleRouter);
router.use("/desired-schedule", desiredScheduleRouter);
router.use("/auth", authRouter)

export default router;