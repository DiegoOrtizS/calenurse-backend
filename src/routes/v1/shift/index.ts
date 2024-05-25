import express, { Response } from "express";
import { GetShiftAssignedParams, PostShiftDesiredBody } from "./dto";
import { CustomRequest } from "../../../types/custom_request";
import { myDataSource } from "../../../app-data-source";
import { Equal, Between } from "typeorm";
import { DesiredShift, GeneratedShift, Nurse } from "../../../entity";
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';

const router = express.Router();


router.get('/assigned', async (req: CustomRequest<{}, GetShiftAssignedParams>, res: Response) => {
    try {
      const { nurse_id } = req.params
      const assignedShiftRepository = myDataSource.getRepository(GeneratedShift);
  
      const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Inicio de la semana (lunes)
      const currentWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 }); // Fin de la semana (domingo)
  
      const assignedShifts = await assignedShiftRepository.find({
        where: {
          date: Between(currentWeekStart, currentWeekEnd),
          nurse: { id: Equal(nurse_id) }, // Filtrar por nurse_id
        },
        relations: ['nurse'], // Cargar la relación con Nurse
      });
  
      res.json(assignedShifts);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
    }
  });


router.post('/desired', async (req: CustomRequest<PostShiftDesiredBody>, res: Response) => {
  try {
    const { date, nurse_id, shift } = req.body;
    const desiredShiftRepository = myDataSource.getRepository(DesiredShift);
    const nurseRepository = myDataSource.getRepository(Nurse);

    // Check if a desired shift already exists for the given date and nurse
    const existingRule = await desiredShiftRepository.findOne({
      where: { date: Equal(date), nurse: {
        id: Equal(nurse_id)
      } }
    });
    if (existingRule) {
      return res.status(400).json({ error: "DESIRED_SHIFT_ALREADY_EXISTS" });
    }

    // Check if the nurse exists
    const nurse = await nurseRepository.findOneBy({ id: Equal(nurse_id) });
    if (!nurse) {
      return res.status(404).json({ error: "NURSE_NOT_FOUND" });
    }

    // Save the desired shift
    const newDesiredShift = desiredShiftRepository.create({ date, shift, nurse });
    await desiredShiftRepository.save(newDesiredShift);

    res.status(201).json({ message: "Desired shift registered successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
});

router.post('/generate', async (req: CustomRequest<PostShiftDesiredBody>, res: Response) => {
  try {
    const { date, nurse_id, shift } = req.body;
    const desiredShiftRepository = myDataSource.getRepository(DesiredShift);
    const nurseRepository = myDataSource.getRepository(Nurse);

    // Check if a desired shift already exists for the given date and nurse
    const existingRule = await desiredShiftRepository.findOne({
      where: { date: Equal(date), nurse: {
        id: Equal(nurse_id)
      } }
    });
    if (existingRule) {
      return res.status(400).json({ error: "DESIRED_SHIFT_ALREADY_EXISTS" });
    }

    // Check if the nurse exists
    const nurse = await nurseRepository.findOneBy({ id: Equal(nurse_id) });
    if (!nurse) {
      return res.status(404).json({ error: "NURSE_NOT_FOUND" });
    }

    // Save the desired shift
    const newDesiredShift = desiredShiftRepository.create({ date, shift, nurse });
    await desiredShiftRepository.save(newDesiredShift);

    res.status(201).json({ message: "Desired shift registered successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
});
export default router;