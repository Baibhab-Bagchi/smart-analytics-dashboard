import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { getGrowth } from "../controllers/dashboardController.js";
import { getRevenue } from "../controllers/dashboardController.js";
import {
  getMonthlyRevenue,
  getMonthlyGrowth
} from "../controllers/dashboardController.js";
const router = express.Router();

router.get("/stats", getDashboardStats);
router.get("/revenue", getRevenue);
router.get("/growth", getGrowth);
router.get("/monthly-revenue", getMonthlyRevenue);
router.get("/monthly-growth", getMonthlyGrowth);
export default router;