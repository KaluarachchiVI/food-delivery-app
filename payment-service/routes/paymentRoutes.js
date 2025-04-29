import express from "express";
import { initiatePayment, handleNotify } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create", initiatePayment);
router.post("/notify", handleNotify);

export default router;
