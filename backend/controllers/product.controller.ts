import { Request, Response } from "express";

export function getProducts(req: Request, res: Response) {

    res.json({
        success: true,
        products: []
    });

}

export function getProduct(req: Request, res: Response) {

    res.json({
        success: true,
        id: req.params.id
    });

}