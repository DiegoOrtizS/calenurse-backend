import express, { Response } from "express";
import { GetShiftAssignedParams, PostShiftDesiredBody, PostShiftGenerateBody } from "./dto";
import { CustomRequest } from "../../../types/custom_request";
import { myDataSource } from "../../../app-data-source";
import { Equal, Between, MoreThanOrEqual } from "typeorm";
import { DesiredShift, GeneratedShift, Nurse } from "../../../entity";
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
import { format, parseISO } from 'date-fns';
import { GetShiftAreaParams } from "./dto/params/get_shift_area.params";


const router = express.Router();

router.get('/get-assigned-shifts-from-date', async (req: CustomRequest<{}, GetShiftAssignedParams>, res: Response) => {
  try {
    const { nurse_id, date } = req.query;

    const assignedShiftRepository = myDataSource.getRepository(GeneratedShift);

    const parsed_date = startOfDay(parseISO(date));
    const currentWeekEnd = endOfDay(endOfWeek(parsed_date, { weekStartsOn: 1 }));


    const assignedShifts = await assignedShiftRepository.find({
      where: {
        date: Between(parsed_date, currentWeekEnd),
        nurse: { id: Equal(nurse_id) },
      },
      relations: ['nurse'],
    });

    const shifts = assignedShifts.map((shift) => ({
      id: shift.id,
      date: shift.date,
      shift: shift.shift
    }))

    res.json(shifts);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});

router.get('/assigned', async (req: CustomRequest<{}, GetShiftAssignedParams>, res: Response) => {
  try {
    const { nurse_id, date } = req.query;

    const assignedShiftRepository = myDataSource.getRepository(GeneratedShift);


    const parsed_date = startOfDay(parseISO(date));

    const assignedShifts = await assignedShiftRepository.find({
      where: {
        date: Equal(parsed_date),
        nurse: { id: Equal(nurse_id) },
      },
      relations: ['nurse'],
    });

    res.json(assignedShifts);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});

router.get('/area', async (req: CustomRequest<{}, GetShiftAreaParams>, res: Response) => {
  try {
    const { boss_id, date } = req.query;

    const assignedShiftRepository = myDataSource.getRepository(GeneratedShift);
    const nurseShiftRepository = myDataSource.getRepository(Nurse);

    const boss = await nurseShiftRepository.findOne(
      {
        where: {
          id: Equal(boss_id),
          isBoss: Equal(true)
        },
      }
    )

    if(!boss) {
      res.status(404).json({ error: "NURSE_NOT_A_BOSS" });
      return;
    }


    const parsed_date = startOfDay(parseISO(date));

    const assignedShifts = await assignedShiftRepository.find({
      where: {
        date: Equal(parsed_date),
        nurse: {
          area: {
            id: Equal(boss.area.id)
          }
        }
      },
      relations: ['nurse'],
    });

    const nursesByShiftTypeArray = Object.entries(assignedShifts.reduce((acc, shift) => {
      const type = shift.shift;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(shift.nurse.name);
      return acc;
    }, {})).map(([shiftType, nurses]) => ({ shiftType, nurses }));

    res.json(nursesByShiftTypeArray);
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

    const desiredDate = startOfDay(new Date(date));

    const existingRule = await desiredShiftRepository.findOne({
      where: { date: Equal(desiredDate), nurse: { id: Equal(nurse_id) } }
    });
    if (existingRule) {
      res.status(400).json({ error: "DESIRED_SHIFT_ALREADY_EXISTS" });
      return;
    }

    const nurse = await nurseRepository.findOneBy({ id: Equal(nurse_id) });
    if (!nurse) {
      res.status(404).json({ error: "NURSE_NOT_FOUND" });
      return;
    }

    const newDesiredShift = desiredShiftRepository.create({ date: desiredDate, shift, nurse });
    await desiredShiftRepository.save(newDesiredShift);

    res.status(201).json({ message: "Desired shift registered successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
});

router.post('/generate', async (req: CustomRequest<PostShiftGenerateBody>, res: Response) => {
  try {
    const { nurse_id } = req.body;
    const desiredShiftRepository = myDataSource.getRepository(DesiredShift);
    const generatedShiftRepository = myDataSource.getRepository(GeneratedShift);
    const nurseRepository = myDataSource.getRepository(Nurse);

    const nurse = await nurseRepository.findOne({
      where: { id: Equal(nurse_id), isBoss: Equal(true) },
      relations: ['area']
    });
    if (!nurse) {
      res.status(403).json({ error: "MUST_BE_A_BOSS_NURSE" });
      return;
    }

    const currentWeekStart = startOfDay(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const currentWeekEnd = endOfDay(endOfWeek(new Date(), { weekStartsOn: 1 }));

    const desiredShifts = await desiredShiftRepository.find({
      where: {
        date: Between(currentWeekStart, currentWeekEnd),
        nurse: { area: { id: Equal(nurse.area.id) } }
      },
      relations: ['nurse'],
    });

    if (desiredShifts.length === 0) {
      res.status(403).json({ error: "DONT_HAVE_DESIRED_SHIFTS" });
      return;
    }

    await generatedShiftRepository.delete({
      date: Between(currentWeekStart, currentWeekEnd),
    });

    for (let desiredShift of desiredShifts) {
      await generatedShiftRepository.save(generatedShiftRepository.create({
        nurse: desiredShift.nurse,
        date: startOfDay(desiredShift.date),
        shift: desiredShift.shift,
      }));
    }

    res.status(201).json({ message: "Shift generated successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
});

export default router;
