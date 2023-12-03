import express from "express";
import { verifyToken } from "@/utils/jwtUtil";
import {
  cancelOrder,
  getOrders,
  placeOrder,
  updateOrder,
} from "@/controllers/orders.controller";
const router = express.Router();

router.get("/orders/customer", verifyToken("customer"), getOrders);
router.get("/orders/owner", verifyToken("owner"), getOrders);
router.post("/orders/place", verifyToken("customer"), placeOrder);
router.delete("/orders/cancel", verifyToken("customer"), cancelOrder);
router.put("/orders/update", verifyToken("owner"), updateOrder);
export default router;
