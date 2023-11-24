// NurseScheduleController.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source'; // Asegúrate de importar correctamente tu DataSource
import { NurseSchedule } from '../entity/NurseSchedule';


export async function getAllSchedules(req: Request, res: Response): Promise<Response> {
    const horarios = await AppDataSource.manager.find(NurseSchedule);
    return res.json(horarios);
}

export async function getSchedules(req: Request, res: Response): Promise<Response> {
    const horario = await AppDataSource.manager.findOneBy(NurseSchedule, { id: parseInt(req.params.id) });
    return horario ? res.json(horario) : res.status(404).json({ message: 'Horario not found' });
}

export async function createSchedule(req: Request, res: Response): Promise<Response> {
    const newHorario = AppDataSource.manager.create(NurseSchedule, req.body);
    const result = await AppDataSource.manager.save(newHorario);
    return res.json(result);
}

export async function updateSchedule(req: Request, res: Response): Promise<Response> {
    const horario = await AppDataSource.manager.findOneBy(NurseSchedule, { id: parseInt(req.params.id) });
    if (horario) {
        AppDataSource.manager.merge(NurseSchedule, horario, req.body);
        const result = await AppDataSource.manager.save(horario);
        return res.json(result);
    }

    return res.status(404).json({ message: 'Horario not found' });
}

export async function deleteSchedule(req: Request, res: Response): Promise<Response> {
    const result = await AppDataSource.manager.delete(NurseSchedule, req.params.id);
    return result.affected ? res.json({ message: 'Horario deleted' }) : res.status(404).json({ message: 'Horario not found' });
}
