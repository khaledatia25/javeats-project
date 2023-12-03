import express, { Router } from "express";
import { logIn, signUp, getProfile } from "@/controllers/admin.controller";
import { verifyToken } from "@/utils/jwtUtil";
const router: Router = express.Router();

router.post("/admin/signup", verifyToken("admin"), signUp);
router.post("/admin/login", logIn);
router.get("/admin/profile", verifyToken("admin"), getProfile);

export default router;
