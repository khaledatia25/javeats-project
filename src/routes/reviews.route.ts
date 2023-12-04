import express, { Router } from "express";
import { verifyToken } from "../utils/jwtUtil";
import { addReview, getReviews } from "../controllers/reviews.controller";
const router: Router = express.Router();

router.post("/reviews/add", verifyToken("customer"), addReview);
router.get("/reviews/:id", getReviews);
export default router;
