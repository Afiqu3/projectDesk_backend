import httpStatus from "http-status";
import type { ProjectWhereInput } from "../../../generated/prisma/models";
import type { IQuery } from "../../interfaces";
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

const getMyProjects = async (query: IQuery, userId: string) => {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy ? query.sortBy : "createdAt";
    const sortOrder = query.sortOrder ? query.sortOrder : "desc";

    const isUserExists = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!isUserExists) {
        throw new AppError(httpStatus.NOT_FOUND, "Student Not Found");
    }

    const andConditions: ProjectWhereInput[] = [
        {
            userId,
        },
    ];

    if (query.searchTerm) {
        andConditions.push({
            OR: [
                {
                    name: {
                        contains: query.searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        });
    }

    if (query.status) {
        andConditions.push({
            status: query.status,
        });
    }

    const projects = await prisma.project.findMany({
        where: { AND: andConditions },
        take: limit,
        skip,
        orderBy: { [sortBy]: sortOrder },
    });

    const total = await prisma.project.count({
        where: { AND: andConditions },
    });

    return {
        data: projects,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

const getProjects = async (query: IQuery) => {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy ? query.sortBy : "createdAt";
    const sortOrder = query.sortOrder ? query.sortOrder : "desc";

    const andConditions: ProjectWhereInput[] = [];

    if (query.searchTerm) {
        andConditions.push({
            OR: [
                {
                    name: {
                        contains: query.searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        });
    }

    if (query.status) {
        andConditions.push({
            status: query.status,
        });
    }

    const projects = await prisma.project.findMany({
        where: { AND: andConditions },
        take: limit,
        skip,
        orderBy: { [sortBy]: sortOrder },
    });

    const total = await prisma.project.count({
        where: { AND: andConditions },
    });

    return {
        data: projects,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const ProjectService = {
    createProject,
    getMyProjects,
    getProjects,
};
