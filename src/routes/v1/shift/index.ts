import express, { Response } from "express";
import { GetShiftAssignedParams, PostShiftDesiredBody, PostShiftGenerateBody } from "./dto";
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
      res.status(400).json({ error: "DESIRED_SHIFT_ALREADY_EXISTS" });
      return
    }

    // Check if the nurse exists
    const nurse = await nurseRepository.findOneBy({ id: Equal(nurse_id) });
    if (!nurse) {
      res.status(404).json({ error: "NURSE_NOT_FOUND" });
      return
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

router.post('/generate', async (req: CustomRequest<PostShiftGenerateBody>, res: Response) => {
  try {
    const { nurse_id, morning, afternoon, night } = req.body;
    const desiredShiftRepository = myDataSource.getRepository(DesiredShift);
    const generatedShiftRepoitory = myDataSource.getRepository(GeneratedShift)
    const nurseRepository = myDataSource.getRepository(Nurse);

    // Check if a desired shift already exists for the given date and nurse
    const nurse = await nurseRepository.findOne({
      where: {
        id: Equal(nurse_id),
        isBoss: Equal(true)
      }
    })
    if (!nurse) {
      res.status(403).json({ error: "MUST_BE_A_BOSS_NURSE" });
      return
    }
    const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Inicio de la semana (lunes)
    const currentWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 }); // Fin de la semana (domingo)

    const desiredShifts = await desiredShiftRepository.find({
        where: {
          date: Between(currentWeekStart, currentWeekEnd),
          nurse: { id: Equal(nurse_id), area: {
            id: Equal(nurse.area.id)
          } }
        },
        relations: ['nurse'],
    });

    if(desiredShifts.length === 0) {
      res.status(403).json({ error: "DONT_HAVE_DESIRED_SHIFTS" });
      return
    }

    await generatedShiftRepoitory.delete({
      date: Between(currentWeekStart, currentWeekEnd),
    })

    for(let desiredShift of desiredShifts) {
      await generatedShiftRepoitory.save(generatedShiftRepoitory.create({
        nurse: desiredShift.nurse,
        date: desiredShift.date,
        shift: desiredShift.shift,
      }))
    }

    res.status(201).json({ message: "Shift generated successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
});
export default router;