import { Request, Response } from "express";

export function getOrders(req: Request, res: Response) {

    res.json({
        success: true,
        orders: []
    });

}

export function createOrder(req: Request, res: Response) {

    res.json({
        success: true,
        order: req.body
    });

}