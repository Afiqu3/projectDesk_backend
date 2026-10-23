import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatsService } from "./stats.service";

const getAdminStats = catchAsync(async (_req: Request, res: Response) => {
    const stats = await StatsService.getAdminStats();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin dashboard stats retrieved successfully",
        data: stats,
    });
});

export const StatsController = {
    getAdminStats,
};
