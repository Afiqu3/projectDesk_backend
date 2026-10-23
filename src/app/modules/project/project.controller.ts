import type { Request, Response } from "express";
import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ProjectService } from "./project.service";

const createProject = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const userId = req.user?.userId;

    if (!userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "No User found!");
    }

    const result = await ProjectService.createProject(payload, userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Parcel created Successfully",
        data: result,
    });
});

export const ProjectController = {
    createProject,
};
