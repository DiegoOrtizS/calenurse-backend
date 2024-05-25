import { Router } from "express";
import authRouter from "./auth";
import shiftRouter from "./shift"
import areaRouter from './area'
const router = Router();

router.use("/auth", authRouter)
router.use("/shift", shiftRouter)
router.use("/area", areaRouter)


export default router;