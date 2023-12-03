import express from "express";
import { verifyToken } from "@/utils/jwtUtil";
import {
  addToCart,
  removeFromCart,
  updateCartItem,
  getCartItems,
} from "@/controllers/cartItem.controller";
const router = express.Router();

router.post("/cartItems/add", verifyToken("customer"), addToCart);
router.delete("/cartItems/remove", verifyToken("customer"), removeFromCart);
router.put("/cartItems/update", verifyToken("customer"), updateCartItem);
router.get("/cartItems", verifyToken("customer"), getCartItems);

export default router;
