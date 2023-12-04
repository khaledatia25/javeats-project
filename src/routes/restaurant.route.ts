import express, { Router } from "express";
import { verifyToken } from "../utils/jwtUtil";
import {
  createRrestaurant,
  listRestaurants,
  updateRestaurant,
} from "../controllers/restaurant.controller";
const router: Router = express.Router();

router.post("/restaurants/add", verifyToken("owner"), createRrestaurant);
router.get("/restaurants", listRestaurants);
router.put("/restaurants", verifyToken("owner"), updateRestaurant);
export default router;
