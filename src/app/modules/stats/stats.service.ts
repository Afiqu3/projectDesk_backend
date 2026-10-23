import { prisma } from "../../lib/prisma";

const TREND_DAYS = 30;
const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000;

// timezone shift.
const trendSince = () =>
	new Date(Date.now() - (TREND_DAYS + 1) * 24 * 60 * 60 * 1000);

const dhakaDayKey = (date: Date) =>
	new Date(date.getTime() + DHAKA_OFFSET_MS).toISOString().slice(0, 10);

const buildDailyTrend = (dates: Date[]): { date: string; count: number }[] => {
	const counts = new Map<string, number>();
	for (const date of dates) {
		const key = dhakaDayKey(date);
		counts.set(key, (counts.get(key) ?? 0) + 1);
	}

	const today = new Date(Date.now() + DHAKA_OFFSET_MS);
	today.setUTCHours(0, 0, 0, 0);

	const series: { date: string; count: number }[] = [];
	for (let i = TREND_DAYS - 1; i >= 0; i--) {
		const day = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
		const key = day.toISOString().slice(0, 10);
		series.push({ date: key, count: counts.get(key) ?? 0 });
	}
	return series;
};

const getAdminStats = async () => {
	const since = trendSince();

    const [totalStudents, totalProjects, recentProjects] = await Promise.all([
        prisma.user.count({
            where: {
                role: "STUDENT",
                isDeleted: false,
            },
        }),
        prisma.project.count({
            where: {
                createdAt: {
                    gte: since,
                },
            },
        }),
        prisma.project.findMany({
            where: {
                createdAt: {
                    gte: since,
                },
            },
            select: {
                createdAt: true,
            },
        }),
    ]);

    return {
        overview: {
            totalStudents,
            totalProjects,
        },
        trends: {
            projects: buildDailyTrend(recentProjects.map((p) => p.createdAt)),
        },
    };
}

export const StatsService = {
    getAdminStats,
};