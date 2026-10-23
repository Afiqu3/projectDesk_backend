import z from "zod";

const collapseSpaces = (s: string) => s.trim().replace(/\s+/g, " ");

export function normalizeRepoUrl(raw: string): string {
    const url = new URL(raw.trim());
    const path = url.pathname
        .replace(/\.git$/i, "")
        .replace(/\/+$/, "")
        .toLowerCase();
    return `https://${url.hostname.toLowerCase()}${path}`;
}

const BLOCKED_HOSTS =
    /^(localhost|127\.|0\.0\.0\.0|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/;

const nameSchema = z
    .string("Project name is required")
    .transform(collapseSpaces)
    .pipe(
        z
            .string()
            .min(3, "Project name must be at least 3 characters")
            .max(80, "Project name must be at most 80 characters")
            .regex(
                /^[\p{L}\p{N} _.\-]+$/u,
                "Only letters, numbers, spaces, - _ . are allowed",
            ),
    );

const repoUrlSchema = z
    .string("Repository URL is required")
    .trim()
    .url("Must be a valid URL")
    .refine(
        (v) =>
            /^https:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+(\.git)?\/?$/i.test(
                v.split(/[?#]/)[0],
            ),
        "Must be a GitHub repo URL like https://github.com/owner/repo",
    )
    .transform((v) => normalizeRepoUrl(v.split(/[?#]/)[0]));

const liveUrlSchema = z
    .string("Live link is required")
    .trim()
    .url("Must be a valid URL")
    .refine((v) => v.startsWith("https://"), "Live link must use https://")
    .refine(
        (v) => !BLOCKED_HOSTS.test(new URL(v).hostname),
        "Local or private addresses are not allowed",
    )
    .transform((v) => {
        const u = new URL(v);
        u.hash = "";
        return u.toString().replace(/\/$/, "");
    });

const descriptionSchema = z
    .string("Description is required")
    .transform((s) => s.trim())
    .pipe(
        z
            .string()
            .min(20, "Description must be at least 20 characters")
            .max(1000, "Description must be at most 1000 characters"),
    );

const createProjectSchema = z.object({
    name: nameSchema,
    repoUrl: repoUrlSchema,
    liveUrl: liveUrlSchema,
    description: descriptionSchema,
});

const reviewProjectSchema = z
    .strictObject({
        status: z.enum(["APPROVED", "REJECTED"], {
            error: "Status must be APPROVED or REJECTED",
        }),
        reviewNote: z
            .string()
            .trim()
            .max(500, "Note must be at most 500 characters")
            .optional()
            .transform((v) => (v ? v : undefined)), // "" -> undefined
    })
    .refine((data) => data.status !== "REJECTED" || !!data.reviewNote, {
        path: ["reviewNote"],
        error: "A note is required when rejecting a project",
    });

export const ProjectValidation = {
    createProjectSchema,
    reviewProjectSchema,
};
