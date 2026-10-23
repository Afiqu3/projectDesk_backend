import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
    type Application,
    type Request,
    type Response,
} from "express";
import httpStatus from "http-status";
import config from "./app/config";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import { AuthRoutes } from "./app/modules/auth/auth.route";
import { ProjectRoutes } from "./app/modules/project/project.route";

const app: Application = express();

app.use(
    cors({
        origin: [config.frontend_url as string, "http://localhost:3000"],
        credentials: true,
    }),
);

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/project", ProjectRoutes);

// Basic route
app.get("/", async (req: Request, res: Response) => {
    res.status(httpStatus.OK).json({
        success: true,
        message: "Welcome to ProjectDesk System Backend",
    });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
