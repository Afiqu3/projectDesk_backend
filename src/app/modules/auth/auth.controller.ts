import type { Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../config";
import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const registerStudent = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const { accessToken, refreshToken, createdUser } =
        await AuthService.registerStudent(payload);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: config.node_env === "development" ? false : true,
        sameSite: config.node_env === "development" ? "lax" : "none",
        maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config.node_env === "development" ? false : true,
        sameSite: config.node_env === "development" ? "lax" : "none",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User register successfully",
        data: {
            accessToken,
            refreshToken,
            createdUser,
        },
    });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await AuthService.loginUser(payload);
    const { accessToken, refreshToken } = result;

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: config.node_env === "development" ? false : true,
        sameSite: config.node_env === "development" ? "lax" : "none",
        maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config.node_env === "development" ? false : true,
        sameSite: config.node_env === "development" ? "lax" : "none",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully",
        data: {
            accessToken,
            refreshToken,
        },
    });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            "User information is missing in the request",
        );
    }

    const result = await AuthService.getMe(userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User profile fetched successfully",
        data: result,
    });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
    if (!req.cookies.refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "Refresh token is missing");
    }
    const result = await AuthService.refreshToken(req.cookies.refreshToken);
    const { accessToken, refreshToken: newRefreshToken } = result;

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: config.node_env === "development" ? false : true,
        sameSite: config.node_env === "development" ? "lax" : "none",
        maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
    });
    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: config.node_env === "development" ? false : true,
        sameSite: config.node_env === "development" ? "lax" : "none",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "New tokens generated successfully",
        data: {
            accessToken,
            refreshToken: newRefreshToken,
        },
    });
});

const logout = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: config.node_env === "development" ? false : true,
        sameSite: config.node_env === "development" ? "lax" : "none",
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: config.node_env === "development" ? false : true,
        sameSite: config.node_env === "development" ? "lax" : "none",
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Logged out successfully",
        data: null,
    });
});

export const AuthController = {
    registerStudent,
    loginUser,
    getMe,
    refreshToken,
    logout,
};
