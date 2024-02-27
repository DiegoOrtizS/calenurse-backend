import { Router } from "express";
import scheduleRouter from "./schedule";
import desiredScheduleRouter from "./desired-schedule";
import authRouter from "./auth";
import notificationsRouter from "./notifications";


const router = Router();

router.use("/schedule", scheduleRouter);
router.use("/desired-schedule", desiredScheduleRouter);
router.use("/auth", authRouter)
router.use("/notifications", notificationsRouter)


export default router;