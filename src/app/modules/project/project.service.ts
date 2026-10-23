import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type { ICreatedProjectPayload } from "./project.interface";

const createProject = async (
    payload: ICreatedProjectPayload,
    userId: string,
) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Student not found");
    }

    if (user.isDeleted) {
        throw new AppError(httpStatus.GONE, "Student account has been deleted");
    }

    const createdProject = await prisma.project.create({
        data: {
            ...payload,
            userId,
        },
    });

    return createdProject;
};

export const ProjectService = {
    createProject,
};
