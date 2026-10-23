import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import type { JwtPayload, SignOptions } from "jsonwebtoken";
import { Role } from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { jwtUtils } from "../../utils/jwt";
import type { ILoginUserPayload, IRegisterPayload } from "./auth.interface";

const registerStudent = async (payload: IRegisterPayload) => {
    const { name, password, email } = payload;

    const isUserExists = await prisma.user.findUnique({
        where: { email },
    });

    if (isUserExists) {
        throw new AppError(
            httpStatus.CONFLICT,
            "User with this email already exists",
        );
    }

    const hashedPassword = await bcrypt.hash(
        password,
        Number(config.bcrypt_salt_rounds),
    );

    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: Role.STUDENT,
        },
        omit: { password: true },
    });

    const jwtPayload = {
        userId: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
    };

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions,
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions,
    );

    return {
        createdUser,
        accessToken,
        refreshToken,
    };
};

const loginUser = async (payload: ILoginUserPayload) => {
    const { password, email } = payload;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (user.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
    }

    const isPasswordMatched = await bcrypt.compare(
        password,
        user.password as string,
    );

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    const jwtPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions,
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions,
    );

    return {
        accessToken,
        refreshToken,
    };
};

const getMe = async (userId: string) => {
    const isUserExists = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        omit: {
            password: true,
        },
    });

    if (!isUserExists) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    return isUserExists;
};

const refreshToken = async (token: string) => {
    const verifiedRefreshToken = jwtUtils.verifyToken(
        token,
        config.jwt_refresh_secret,
    );

    if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            config.node_env === "development"
                ? verifiedRefreshToken.error
                : "Invalid refresh token",
        );
    }

    const data = verifiedRefreshToken.data as JwtPayload;

    const user = await prisma.user.findUnique({
        where: { id: data.userId },
    });

    if (!user || user.isDeleted) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User is not found");
    }

    const jwtPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions,
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions,
    );

    return {
        accessToken,
        refreshToken,
    };
};

export const AuthService = {
    registerStudent,
    loginUser,
    getMe,
    refreshToken,
};
