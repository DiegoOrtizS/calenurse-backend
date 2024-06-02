import express, { Request, Response } from "express"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { myDataSource } from "../../../app-data-source";
import { Area, User, Nurse } from "../../../entity";

const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const userRepository = myDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { username } });
        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                const token = jwt.sign({ userId: user.id, nurseId: user.nurse.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
                return res.status(200).json({ user: user, token: token });
            }
            return res.status(401).json({ message: 'Invalid credentials' });
        } 
        return res.status(404).json({ message: 'User not found' });
    } catch (error) {
	console.log(error)
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/signup', async (req: Request, res: Response) => {
    const { username, password, name, age, email, isBoss, areaId } = req.body;

    try {
        const userRepository = myDataSource.getRepository(User);
        const userExists = await userRepository.findOne({ where: { username } });
        if (userExists)
            return res.status(409).json({ message: 'Usuario ya registrado' });
        const nurseRepository = myDataSource.getRepository(Nurse);
        const areaRepository = myDataSource.getRepository(Area);
        const area = await areaRepository.findOneBy({ id: areaId });
        if (!area)
            return res.status(404).json({ message: 'Area not found' });
        const nurse = await nurseRepository.save({ name, age, email, isBoss, area });
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT));
        await userRepository.save({ username, password: hashedPassword, nurse });
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'User creation failed' });
	console.log(error)
    }
});

export default router;
