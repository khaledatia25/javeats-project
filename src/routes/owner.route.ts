import express, { Router } from "express";
import { logIn, signUp, getProfile } from "@/controllers/owner.controller";
import { verifyToken } from "@/utils/jwtUtil";
const router: Router = express.Router();

router.post("/owner/signup", verifyToken("admin"), signUp);
router.post("/owner/login", logIn);
router.get("/owner/profile", verifyToken("owner"), getProfile);

export default router;
