import express from "express";
import { acceptOrder } from "../controllers";
import { validateOrder } from "../middleware";

const router = express.Router();
router.post("/", validateOrder, acceptOrder);

export default router;
