import { Request, Response } from 'express';
import { AppDataSource } from '../data-source'; // Ensure you import your DataSource correctly
import { User } from '../entity/User';

export async function getAllUsers(req: Request, res: Response): Promise<Response> {
    const users = await AppDataSource.manager.find(User);
    return res.json(users);
}

export async function getUser(req: Request, res: Response): Promise<Response> {
    const user = await AppDataSource.manager.findOneBy(User, { id: parseInt(req.params.id) });
    return user ? res.json(user) : res.status(404).json({ message: 'User not found' });
}

export async function createUser(req: Request, res: Response): Promise<Response> {
    const newUser = AppDataSource.manager.create(User, req.body);
    const result = await AppDataSource.manager.save(newUser);
    return res.json(result);
}

export async function updateUser(req: Request, res: Response): Promise<Response> {
    const user = await AppDataSource.manager.findOneBy(User, { id: parseInt(req.params.id) });
    if (user) {
        AppDataSource.manager.merge(User, user, req.body);
        const result = await AppDataSource.manager.save(user);
        return res.json(result);
    }

    return res.status(404).json({ message: 'User not found' });
}

export async function deleteUser(req: Request, res: Response): Promise<Response> {
    const result = await AppDataSource.manager.delete(User, req.params.id);
    return result.affected ? res.json({ message: 'User deleted' }) : res.status(404).json({ message: 'User not found' });
}
