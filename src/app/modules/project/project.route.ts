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

router.get("/", auth(Role.ADMIN), ProjectController.getProjects);

router.get("/my-projects", auth(Role.STUDENT), ProjectController.getMyProjects);

router.patch(
    "/:id/review",
    auth(Role.ADMIN),
    validateRequest(ProjectValidation.reviewProjectSchema),
    ProjectController.reviewProject,
);

export const ProjectRoutes = router;
