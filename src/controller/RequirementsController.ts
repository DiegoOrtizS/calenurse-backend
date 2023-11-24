// NurseRequirementsssController.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source'; // Asegúrate de que importas correctamente tu DataSource
import { NurseRequirements } from '../entity/NurseRequirements';

export async function getAllRequirements(req: Request, res: Response): Promise<Response> {
    const requirements = await AppDataSource.manager.find(NurseRequirements);
    return res.json(requirements);
}

export async function getRequirements(req: Request, res: Response): Promise<Response> {
    const requirement = await AppDataSource.manager.findOneBy(NurseRequirements, { id: parseInt(req.params.id) });
    return requirement ? res.json(requirement) : res.status(404).json({ message: 'Requerimiento not found' });
}

export async function createRequirement(req: Request, res: Response): Promise<Response> {
    const newRequirement = AppDataSource.manager.create(NurseRequirements, req.body);
    const result = await AppDataSource.manager.save(newRequirement);
    return res.json(result);
}

export async function updateRequirement(req: Request, res: Response): Promise<Response> {
    const requirement = await AppDataSource.manager.findOneBy(NurseRequirements, { id: parseInt(req.params.id) });
    if (requirement) {
        AppDataSource.manager.merge(NurseRequirements, requirement, req.body);
        const result = await AppDataSource.manager.save(requirement);
        return res.json(result);
    }

    return res.status(404).json({ message: 'Requerimiento not found' });
}

export async function deleteRequirement(req: Request, res: Response): Promise<Response> {
    const result = await AppDataSource.manager.delete(NurseRequirements, req.params.id);
    return result.affected ? res.json({ message: 'Requerimiento deleted' }) : res.status(404).json({ message: 'Requerimiento not found' });
}
