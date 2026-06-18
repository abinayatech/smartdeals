import { Router } from "express";
import * as controller from "../controllers/product.controller";

const router = Router();

router.get("/", controller.getProducts);

router.get("/:id", controller.getProduct);

export default router;