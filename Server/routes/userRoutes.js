import express from "express";
import {
  getAllUsers,
  deleteUser,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

// GET all users
router.get("/", getAllUsers);

// DELETE user
router.delete("/:id", deleteUser);

// ✅ UPDATE user role
router.put("/:id", updateUser);

export default router;