import express, { Router } from "express";
import { getProfile, logIn, signUp } from "../controllers/customer.controller";
import { verifyToken } from "../utils/jwtUtil";
const router: Router = express.Router();

router.post("/customer/signup", signUp);
router.post("/customer/login", logIn);
router.get("/customer/profile", verifyToken("customer"), getProfile);

export default router;
