import express, { Router } from "express";
import { verifyToken } from "@/utils/jwtUtil";
import {
  listMenus,
  createMenu,
  updateMenu,
  deleteMenu,
} from "@/controllers/menu.controller";
const router: Router = express.Router();

router.post("/menus/add", verifyToken("owner"), createMenu);
router.get("/menus/:id", listMenus);
router.put("/menus/:id", verifyToken("owner"), updateMenu);
router.delete("/menus/:id", verifyToken("owner"), deleteMenu);

export default router;
