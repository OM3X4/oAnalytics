import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { RollUpResponse } from "@/app/types/types";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

	const searchParams: any = req.nextUrl.searchParams
	console.log(searchParams)

	let country = searchParams.get("country")
	let browser = searchParams.get("browser")
	let os = searchParams.get("os")
	let path = searchParams.get("path")

	let from = new Date(searchParams.from);
	let to = new Date(searchParams.to);
	if (isNaN(from.getTime())) {
		from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
		from.setHours(0, 0, 0, 0);
	}
	if (isNaN(to.getTime())) {
		to = new Date();
	}
	const timeRange = { from: from.toISOString().split('T')[0], to: to.toISOString().split('T')[0] };

	const session = await auth()

	const id = params.id

	if (!id) {
		return NextResponse.json({ error: "No id" }, { status: 400 })
	}

	if (!session || !session.user || !session.user.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
	}


	const project = await prisma.app.findUnique({
		where: {
			id
		}
	})

	if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 })


	const onlineVisitors: any[] = await prisma.$queryRaw`
        SELECT COUNT(DISTINCT "client_id") AS unique_clients
        FROM "Event"
        WHERE "app_id" = ${id}
            AND "client_id" IS NOT NULL
            AND "date" >= NOW() - INTERVAL '3 minutes'
    `;

	const conditions: string[] = [
		`bucket BETWEEN '${timeRange.from}'::date AND '${timeRange.to}'::date`
	];

	console.log(browser)
	if (browser) {
		conditions.push(`browser = '${browser}'`);
	}
	console.log(country)
	if (country) {
		conditions.push(`country = '${country}'`);
	}
	console.log(os)
	if (os) {
		conditions.push(`os = '${os}'`);
	}
	console.log((path))
	if (path) {
		conditions.push(`path = '${(path)}'`);
	}

	const whereClause = conditions.length ? `AND ${conditions.join(" AND ")}` : "";

	console.log(whereClause)

	const query = `
		SELECT
			bucket,
			path,
			country,
			browser,
			os,
			SUM(views) AS views,
			SUM(unique_visitors) AS visitors
		FROM event_rollup_hourly
		WHERE app_id = '${id}'::uuid
		${whereClause}
		GROUP BY GROUPING SETS (
			(bucket),
			(path),
			(country),
			(browser),
			(os)
		)
		ORDER BY bucket ASC NULLS LAST;
	`;

	let theNewSqlQuery: RollUpResponse[] = await prisma.$queryRawUnsafe(query);

	theNewSqlQuery = theNewSqlQuery.map((item: any) => ({
		bucket: item.bucket,
		path: item.path,
		country: item.country,
		browser: item.browser,
		os: item.os,
		views: Number(item.views),
		visitors: Number(item.visitors)
	}));

	console.log(theNewSqlQuery)

	return NextResponse.json({ data: theNewSqlQuery, project, onlineVisitors: Number(onlineVisitors[0].unique_clients) }, { status: 201 })

}