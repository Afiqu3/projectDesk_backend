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

const getMyProjects = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "No User found!");
    }

    const { data, meta } = await ProjectService.getMyProjects(
        req.query,
        userId,
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Projects Retrieved Successfully",
        data,
        meta,
    });
});

const getProjects = catchAsync(async (req: Request, res: Response) => {
    const { data, meta } = await ProjectService.getProjects(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Parcels Retrieved Successfully",
        data,
        meta,
    });
});

const reviewProject = catchAsync(async (req: Request, res: Response) => {
    const projectId = req.params.id as string;
    const payload = req.body;

    const result = await ProjectService.reviewProject(
        payload,
        projectId,
        req.user?.userId as string,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Project status updated successfully",
        data: result,
    });
});

export const ProjectController = {
    createProject,
    getMyProjects,
    getProjects,
    reviewProject,
};
