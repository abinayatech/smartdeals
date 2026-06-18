import { Request, Response } from "express";

export function login(req: Request, res: Response) {
    res.json({
        success: true,
        message: "Login endpoint",
        data: req.body
    });
}

export function register(req: Request, res: Response) {
    res.json({
        success: true,
        message: "Register endpoint",
        data: req.body
    });
}