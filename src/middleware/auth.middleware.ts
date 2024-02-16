import { Request, Response } from "express";
import jwt from "jsonwebtoken";

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