import express from "express";
import order from "./Order";

const router = express.Router();
router.use("/order", order);

export default router;
