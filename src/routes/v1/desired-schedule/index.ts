import { Router } from "express";
import { Request, Response } from "express";

import { myDataSource } from "../../../app-data-source";
import { CustomRequest, checkAuthHeader } from "../../../middleware/auth.middleware";
import { DesiredShift, Nurse } from "../../../entity";
import { Equal } from "typeorm";

const router = Router();

router.post("/register", checkAuthHeader, async (req: CustomRequest, res: Response) => {
    try {
        const { date, shift } = req.body;
        const [month, day, year] = date.split('/');
        const parsedDate = new Date(`${year}-${month}-${day}`);
        // funciona
        parsedDate.setHours(parsedDate.getHours() + 5);    
        const desiredShiftRepository = myDataSource.getRepository(DesiredShift);
        const nurseRepository = myDataSource.getRepository(Nurse);
        const nurse = await nurseRepository.findOneBy({ id: Equal(req.nurseId) });
        const existingShift = await desiredShiftRepository.findOne({
            where: {
                nurse: Equal(nurse.id),
                date: parsedDate,
            },
        });
        if (existingShift)
            return res.status(409).json({ message: "Desired shift already exists" });
        await desiredShiftRepository.save({ date: parsedDate, shift, nurse });
        res.status(201).json({ message: "Desired shift registered successfully" });
    } catch (error) {
        res.json({ message: "error", data: error });
    }
});


export default router;