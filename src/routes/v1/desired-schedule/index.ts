import { Router } from "express";
import { Response } from "express";

import { myDataSource } from "../../../app-data-source";
import { CustomRequest, checkAuthHeader, checkIsBoss } from "../../../middleware/auth.middleware";
import { DesiredShift, Nurse } from "../../../entity";
import { Equal } from "typeorm";
import { DateTime } from "luxon";

const router = Router();

router.post("/register", checkAuthHeader, async (req: CustomRequest, res: Response) => {
    try {
        const { date, shift } = req.body;
        
        const parsedDate = DateTime.fromFormat(date, "dd/MM/yyyy");
        const currentDate = DateTime.now();
        if (parsedDate < currentDate) {
            return res.status(400).json({ message: "Desired shift date should be equal or later than the current date" });
        }

        const desiredShiftRepository = myDataSource.getRepository(DesiredShift);
        const nurseRepository = myDataSource.getRepository(Nurse);
        const nurse = await nurseRepository.findOneBy({ id: Equal(req.nurseId) });

        const jsDate = parsedDate.toJSDate();
        const existingShift = await desiredShiftRepository.findOne({
            where: {
                nurse: Equal(nurse.id),
                date: jsDate,
            },
        });

        if (existingShift) {
            return res.status(409).json({ message: "Desired shift already exists" });
        }

        await desiredShiftRepository.save({ date: jsDate, shift, nurse });
        res.status(201).json({ message: "Desired shift registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error", data: error.message || error });
    }
});

router.put("/change-desired-schedule", checkAuthHeader, async (req: CustomRequest, res: Response) => {
    try {
        const { date, shift } = req.body;
        
        const parsedDate = DateTime.fromFormat(date, "dd/MM/yyyy");
        const currentDate = DateTime.now();
        if (parsedDate < currentDate) {
            return res.status(400).json({ message: "Desired shift date should be equal or later than the current date" });
        }

        const desiredShiftRepository = myDataSource.getRepository(DesiredShift);

        const jsDate = parsedDate.toJSDate();
        const existingShift = await desiredShiftRepository.findOne({
            where: {
                nurse: Equal(req.nurseId),
                date: jsDate,
            },
        });

        if (!existingShift) {
            return res.status(404).json({ message: "Desired shift not found" });
        }

        existingShift.shift = shift;
        existingShift.accepted = false;
        await desiredShiftRepository.save(existingShift);
        res.status(200).json({ message: "Desired shift updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error", data: error.message || error });
    }
});

router.put("/accept-desired-schedule/:scheduleId", checkAuthHeader, async (req: CustomRequest, res: Response) => {
    try {
        const desiredShiftRepository = myDataSource.getRepository(DesiredShift);

        const existingShift = await desiredShiftRepository.findOne({
            where: {
                id: Equal(req.params.scheduleId),
            },
        });

        if (!existingShift) {
            return res.status(404).json({ message: "Desired shift not found" });
        }

        existingShift.accepted = true;
        await desiredShiftRepository.save(existingShift);
        res.status(200).json({ message: "Desired shift accepted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error", data: error.message || error });
    }
});

router.delete("/delete-desired-schedule/:scheduleId", checkAuthHeader, async (req: CustomRequest, res: Response) => {
    try {
        const desiredShiftRepository = myDataSource.getRepository(DesiredShift);

        const existingShift = await desiredShiftRepository.findOne({
            where: {
                id: Equal(req.params.scheduleId),
            },
        });

        if (!existingShift) {
            return res.status(404).json({ message: "Desired shift not found" });
        }

        await desiredShiftRepository.remove(existingShift);
        res.status(200).json({ message: "Desired shift deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error", data: error.message || error });
    }
});

router.get("/desired-schedules", checkAuthHeader, async (req: CustomRequest, res: Response) => {
    try {
        const desiredShiftRepository = myDataSource.getRepository(DesiredShift);
        const desiredShifts = await desiredShiftRepository.find({
            order: {
                date: "ASC"
            }
        });

        res.status(200).json({ data: desiredShifts });
    } catch (error) {
        res.status(500).json({ message: "Error", data: error.message || error });
    }
});

export default router;
