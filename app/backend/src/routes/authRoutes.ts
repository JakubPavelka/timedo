import express from "express";
import {
  login,
  logout,
  register,
  refresh,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);

export default router;
