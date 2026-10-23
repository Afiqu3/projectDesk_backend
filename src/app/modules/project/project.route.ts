import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { ProjectController } from "./project.controller";
import { ProjectValidation } from "./project.validation";

const router = Router();

router.post(
    "/",
    auth(Role.STUDENT),
    validateRequest(ProjectValidation.createProjectSchema),
    ProjectController.createProject,
);

export const ProjectRoutes = router;
