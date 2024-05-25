import { Router } from "express";
import authRouter from "./auth";
import shiftRouter from "./shift"

const router = Router();

router.use("/auth", authRouter)
router.use("/shift", shiftRouter)


export default router;