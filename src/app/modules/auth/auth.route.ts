import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = Router();

router.post(
    "/register",
    validateRequest(AuthValidation.registrationSchema),
    AuthController.registerStudent,
);

router.post(
    "/login",
    validateRequest(AuthValidation.loginSchema),
    AuthController.loginUser,
);

router.get("/me", auth(Role.ADMIN, Role.STUDENT), AuthController.getMe);

router.post("/refresh", AuthController.refreshToken);

router.post("/logout", AuthController.logout);

export const AuthRoutes = router;
