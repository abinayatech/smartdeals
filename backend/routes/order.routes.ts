import { Router } from "express";
import * as controller from "../controllers/order.controller";

const router = Router();

router.get("/", controller.getOrders);

router.post("/", controller.createOrder);

export default router;


