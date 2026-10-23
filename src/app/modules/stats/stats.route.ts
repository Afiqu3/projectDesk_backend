import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { StatsController } from "./stats.controller";

const router = Router();

router.get("/admin", auth(Role.ADMIN), StatsController.getAdminStats);

export const StatsRoutes = router;
