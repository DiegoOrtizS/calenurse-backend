import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { myDataSource } from "../app-data-source";
import { Nurse } from "../entity";
import { Equal } from "typeorm";

export interface CustomRequest extends Request {
    nurseId: string;
}

interface DecodedToken {
    userId: string;
    nurseId: string;
    iat: number;
    exp: number;
}

export const checkAuthHeader = (req: CustomRequest, res: Response, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        jwt.verify(authHeader, process.env.JWT_SECRET, (err: any, decode: DecodedToken) => {
            if (err) {
                res.status(401).json({ message: "Unauthorized" });
            } else {
                req.nurseId = decode.nurseId;
                next();
            }
        });
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
};

export const checkIsBoss = (req: CustomRequest, res: Response, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        jwt.verify(authHeader, process.env.JWT_SECRET, async (err: any, decode: DecodedToken) => {
            if (err) {
                res.status(401).json({ message: "Unauthorized" });
            } else {
                const nurseRepository = myDataSource.getRepository(Nurse);
                const nurse = await nurseRepository.findOneBy({ id: Equal(req.nurseId) });
                console.log(nurse);
                if (nurse.isBoss) {
                    req.nurseId = decode.nurseId;
                    next();
                } else {
                    res.status(401).json({ message: "Unauthorized" });
                }
            }
        });
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
}