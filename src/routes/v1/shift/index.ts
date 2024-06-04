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
import { PostShiftExchangeBody } from "./dto/body/post_shift_exchange.body";
import { ShiftExchange } from "../../../entity/shift_exchange.entity";
import { GetShiftExchangeParams } from "./dto/params/get_shift_exchange.params";


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

router.post('/exchange', async (req: CustomRequest<PostShiftExchangeBody, {}>, res: Response) => {
  try {
    const { shift_a, shift_b } = req.body;
    const shiftEchangeRepository = myDataSource.getRepository(ShiftExchange);
    const generattedShiftRepository = myDataSource.getRepository(GeneratedShift);

    const shiftA = await generattedShiftRepository.findOne({
      where: {
        id: Equal(shift_a)
      }
    });

    const shiftB = await generattedShiftRepository.findOne({
      where: {
        id: Equal(shift_b)
      }
    });

    if (!shiftA) {
      return res.status(404).json({ error: "ShiftA not found" });
    }
    if (!shiftB) {
      return res.status(404).json({ error: "ShiftB not found" });
    }

    // Buscar si ya existe un intercambio de turnos entre los dos turnos especificados
    const existingExchange = await shiftEchangeRepository.find({
      where: [
        { shiftA: Equal(shiftA.id), shiftB: Equal(shiftB.id), state: Equal(true) },
        { shiftA: Equal(shiftB.id), shiftB: Equal(shiftA.id), state: Equal(true) }
      ]
    });
    
    console.log(existingExchange)

    if (existingExchange.length) {
      return res.status(400).json({ error: "Shift exchange already exists" });
    }

    const newShiftExchange = shiftEchangeRepository.create({
      shiftA: shiftA,
      shiftB: shiftB,
      state: true
    });

    await shiftEchangeRepository.save(newShiftExchange);

    return res.status(201).json({ message: "Shift exchange registered successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
});


router.get('/exchange', async (req: CustomRequest<{}, GetShiftExchangeParams>, res: Response) => {
  try {
    const { nurse_id } = req.query;
    console.log(nurse_id);
    const shiftExchangeRepository = myDataSource.getRepository(ShiftExchange);
    const nurseRepository = myDataSource.getRepository(Nurse);

    const nurse = await nurseRepository.findOne({
      where: { id: Equal(nurse_id), isBoss: Equal(true) },
      relations: ['area']
    });
    if (!nurse) {
      res.status(403).json({ error: "MUST_BE_A_BOSS_NURSE" });
      return;
    }

    const shiftsExchange = await shiftExchangeRepository.find({
      where: {
        state: Equal(true),
        shiftA: {
          nurse: {
            area: {
              id: Equal(nurse.area.id)
            }
          }
        },
        shiftB: {
          nurse: {
            area: {
              id: Equal(nurse.area.id)
            }
          }
        }
      },
      relations: ['shiftA', 'shiftA.nurse', 'shiftB', 'shiftB.nurse']
    });

    const mappedShiftsExchange = shiftsExchange.map(exchange => ({
      id: exchange.id,
      state: exchange.state,
      shiftA: {
        date: exchange.shiftA.date,
        shift: exchange.shiftA.shift,
        nurseName: exchange.shiftA.nurse.name
      },
      shiftB: {
        date: exchange.shiftB.date,
        shift: exchange.shiftB.shift,
        nurseName: exchange.shiftB.nurse.name
      }
    }));

    res.status(200).json(mappedShiftsExchange);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
});

router.put('/exchange/accept', async (req: CustomRequest<{ exchange_id: string }, {}>, res: Response) => {
  try {
    const { exchange_id } = req.body;
    const shiftExchangeRepository = myDataSource.getRepository(ShiftExchange);
    const generatedShiftRepository = myDataSource.getRepository(GeneratedShift);

    const exchange = await shiftExchangeRepository.findOne({
      where: { id: Equal(exchange_id), state: Equal(true) },
      relations: ['shiftA', 'shiftB', 'shiftA.nurse', 'shiftB.nurse']
    });

    if (!exchange) {
      res.status(404).json({ error: "EXCHANGE_NOT_FOUND" });
      return;
    }

    const { shiftA, shiftB } = exchange;

    console.log(shiftA, shiftB)

    // Intercambiar las enfermeras en los horarios
    const tempNurse = shiftA.nurse;
    shiftA.nurse = shiftB.nurse;
    shiftB.nurse = tempNurse;

    console.log(shiftA, shiftB)


    // Actualizar el estado del intercambio a false
    exchange.state = false;

    await generatedShiftRepository.save([shiftA, shiftB]);
    await shiftExchangeRepository.save(exchange);

    res.status(200).json({ message: "EXCHANGE_ACCEPTED" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
});

router.put('/exchange/decline', async (req: CustomRequest<{ exchange_id: string }, {}>, res: Response) => {
  try {
    const { exchange_id } = req.body;
    const shiftExchangeRepository = myDataSource.getRepository(ShiftExchange);

    const exchange = await shiftExchangeRepository.findOne({
      where: { id: Equal(exchange_id), state: Equal(true) }
    });

    if (!exchange) {
      res.status(404).json({ error: "EXCHANGE_NOT_FOUND" });
      return;
    }

    // Actualizar el estado del intercambio a false
    exchange.state = false;

    await shiftExchangeRepository.save(exchange);

    res.status(200).json({ message: "EXCHANGE_DECLINED" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
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

    await generatedShiftRepository.createQueryBuilder()
    .delete()
    .from(GeneratedShift)
    .where('date BETWEEN :startDate AND :endDate', {
      startDate: currentWeekStart,
      endDate: currentWeekEnd
    })
    .andWhere('"nurseId" IN (SELECT "id" FROM "nurse" WHERE "areaId" = :areaId)', {
      areaId: nurse.area.id
    })
    .execute();

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
