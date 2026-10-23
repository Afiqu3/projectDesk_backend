export type ProjectStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ICreatedProjectPayload {
    id: string;
    name: string;
    repoUrl: string;
    liveUrl: string;
    description: string;
}

export interface IReviewedProjectPayload {
    status: ProjectStatus;
    reviewNote: string | null;
}
