import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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

    const hours24: any[] = await prisma.$queryRaw`
  WITH hours AS (
    SELECT generate_series(
      date_trunc('hour', NOW() - INTERVAL '23 hours'),
      date_trunc('hour', NOW()),
      '1 hour'::interval
    ) AS bucket
  )
  SELECT
    h.bucket,
    COUNT(e.*) AS count
  FROM hours h
  LEFT JOIN "Event" e
    ON date_trunc('hour', e."date") = h.bucket
    AND e."app_id" = ${id}
  GROUP BY h.bucket
  ORDER BY h.bucket ASC
`;

    const week: any[] = await prisma.$queryRaw`
  WITH days AS (
    SELECT generate_series(
      date_trunc('day', NOW() - INTERVAL '6 days'),
      date_trunc('day', NOW()),
      '1 day'::interval
    ) AS bucket
  )
  SELECT
    d.bucket,
    COUNT(e.*) AS count
  FROM days d
  LEFT JOIN "Event" e
    ON date_trunc('day', e."date") = d.bucket
    AND e."app_id" = ${id}
  GROUP BY d.bucket
  ORDER BY d.bucket ASC
`;

    const month: any[] = await prisma.$queryRaw`
  WITH days AS (
    SELECT generate_series(
      date_trunc('day', NOW() - INTERVAL '29 days'),
      date_trunc('day', NOW()),
      '1 day'::interval
    ) AS bucket
  )
  SELECT
    d.bucket,
    COUNT(e.*) AS count
  FROM days d
  LEFT JOIN "Event" e
    ON date_trunc('day', e."date") = d.bucket
    AND e."app_id" = ${id}
  GROUP BY d.bucket
  ORDER BY d.bucket ASC
`;

    const hours24Unique: any[] = await prisma.$queryRaw`
  WITH hours AS (
    SELECT generate_series(
      date_trunc('hour', NOW() - INTERVAL '23 hours'),
      date_trunc('hour', NOW()),
      '1 hour'::interval
    ) AS bucket
  )
  SELECT
    h.bucket,
    COUNT(DISTINCT e."client_id") AS unique_clients
  FROM hours h
  LEFT JOIN "Event" e
    ON date_trunc('hour', e."date") = h.bucket
    AND e."app_id" = ${id}
  GROUP BY h.bucket
  ORDER BY h.bucket ASC
`;

    const weekUnique: any[] = await prisma.$queryRaw`
  WITH days AS (
    SELECT generate_series(
      date_trunc('day', NOW() - INTERVAL '6 days'),
      date_trunc('day', NOW()),
      '1 day'::interval
    ) AS bucket
  )
  SELECT
    d.bucket,
    COUNT(DISTINCT e."client_id") AS unique_clients
  FROM days d
  LEFT JOIN "Event" e
    ON date_trunc('day', e."date") = d.bucket
    AND e."app_id" = ${id}
  GROUP BY d.bucket
  ORDER BY d.bucket ASC
`;

    const monthUnique: any[] = await prisma.$queryRaw`
  WITH days AS (
    SELECT generate_series(
      date_trunc('day', NOW() - INTERVAL '29 days'),
      date_trunc('day', NOW()),
      '1 day'::interval
    ) AS bucket
  )
  SELECT
    d.bucket,
    COUNT(DISTINCT e."client_id") AS unique_clients
  FROM days d
  LEFT JOIN "Event" e
    ON date_trunc('day', e."date") = d.bucket
    AND e."app_id" = ${id}
  GROUP BY d.bucket
  ORDER BY d.bucket ASC
`;



    const visitors = {
        hours24: hours24Unique.map((item: any) => ({ bucket: item.bucket, count: Number(item.unique_clients) })),
        week: weekUnique.map((item: any) => ({ bucket: item.bucket, count: Number(item.unique_clients) })),
        month: monthUnique.map((item: any) => ({ bucket: item.bucket, count: Number(item.unique_clients) }))
    }
    const views = {
        hours24: hours24.map((item: any) => ({ bucket: item.bucket, count: Number(item.count) })),
        week: week.map((item: any) => ({ bucket: item.bucket, count: Number(item.count) })),
        month: month.map((item: any) => ({ bucket: item.bucket, count: Number(item.count) }))
    }


    const onlineVisitors: any[] = await prisma.$queryRaw`
        SELECT COUNT(DISTINCT "client_id") AS unique_clients
        FROM "Event"
        WHERE "app_id" = ${id}
            AND "client_id" IS NOT NULL
            AND "date" >= NOW() - INTERVAL '3 minutes'
    `;

    const routeHours: any[] = await prisma.$queryRaw`
        SELECT
            "path",
            COUNT(*) AS total_events,
            COUNT(DISTINCT "client_id") AS unique_visitors
        FROM "Event"
        WHERE "app_id" = ${id}
            AND "date" >= NOW() - INTERVAL '24 hours'
        GROUP BY "path"
        ORDER BY total_events DESC
    `;
    const routeWeek: any[] = await prisma.$queryRaw`
        SELECT
            "path",
            COUNT(*) AS total_events,
            COUNT(DISTINCT "client_id") AS unique_visitors
        FROM "Event"
        WHERE "app_id" = ${id}
            AND "date" >= NOW() - INTERVAL '7 days'
        GROUP BY "path"
        ORDER BY total_events DESC
    `;
    const routeMonth: any[] = await prisma.$queryRaw`
        SELECT
            "path",
            COUNT(*) AS total_events,
            COUNT(DISTINCT "client_id") AS unique_visitors
        FROM "Event"
        WHERE "app_id" = ${id}
            AND "date" >= NOW() - INTERVAL '30 days'
        GROUP BY "path"
        ORDER BY total_events DESC
    `;
    /*
    [
    { path: '/home', total_events: 120, unique_visitors: 50 },
    { path: '/about', total_events: 30, unique_visitors: 25 },
    ...
    ]
    */

    const routes = {
        hours24: routeHours.map(item => ({ path: item.path, total_events: Number(item.total_events), unique_visitors: Number(item.unique_visitors) })),
        week: routeWeek.map(item => ({ path: item.path, total_events: Number(item.total_events), unique_visitors: Number(item.unique_visitors) })),
        month: routeMonth.map(item => ({ path: item.path, total_events: Number(item.total_events), unique_visitors: Number(item.unique_visitors) }))
    }

    // [
    //     { country: 'US', total_events: 120, unique_visitors: 45 },
    //     { country: 'EG', total_events: 80, unique_visitors: 30 },
    //     { country: 'FR', total_events: 20, unique_visitors: 15 },
    //     { country: null, total_events: 5, unique_visitors: 5 } // unknown country
    // ]
    const countriesMonth: any[] = await prisma.$queryRaw`
        SELECT
            "country",
            COUNT(*) AS total_events,
            COUNT(DISTINCT "client_id") AS unique_visitors
        FROM "Event"
        WHERE "app_id" = ${id}
            AND "date" >= NOW() - INTERVAL '30 days'
        GROUP BY "country"
        ORDER BY total_events DESC
        `;
    const countriesWeek: any[] = await prisma.$queryRaw`
        SELECT
            "country",
            COUNT(*) AS total_events,
            COUNT(DISTINCT "client_id") AS unique_visitors
        FROM "Event"
        WHERE "app_id" = ${id}
            AND "date" >= NOW() - INTERVAL '7 days'
        GROUP BY "country"
        ORDER BY total_events DESC
        `;
    const countriesHours: any[] = await prisma.$queryRaw`
        SELECT
            "country",
            COUNT(*) AS total_events,
            COUNT(DISTINCT "client_id") AS unique_visitors
        FROM "Event"
        WHERE "app_id" = ${id}
            AND "date" >= NOW() - INTERVAL '24 hours'
        GROUP BY "country"
        ORDER BY total_events DESC
        `;

    const countries = {
        hours24: countriesHours.map(item => ({ country: item.country, total_events: Number(item.total_events), unique_visitors: Number(item.unique_visitors) })),
        week: countriesWeek.map(item => ({ country: item.country, total_events: Number(item.total_events), unique_visitors: Number(item.unique_visitors) })),
        month: countriesMonth.map(item => ({ country: item.country, total_events: Number(item.total_events), unique_visitors: Number(item.unique_visitors) }))
    }

    // [
    //     { browser: 'Chrome', total_events: 120, unique_visitors: 50 },
    //     { browser: 'Firefox', total_events: 40, unique_visitors: 30 },
    //     { browser: null, total_events: 5, unique_visitors: 5 } // unknown
    // ]

    const browsersMonth: any[] = await prisma.$queryRaw`
        SELECT
            "browser" AS browser,
            COUNT(*) AS total_events,
            COUNT(DISTINCT "client_id") AS unique_visitors
        FROM "Event"
        WHERE "app_id" = ${id}
            AND "date" >= NOW() - INTERVAL '30 days'
        GROUP BY "browser"
        ORDER BY total_events DESC
        `;
    const browsersWeek: any[] = await prisma.$queryRaw`
        SELECT
            "browser" AS browser,
            COUNT(*) AS total_events,
            COUNT(DISTINCT "client_id") AS unique_visitors
        FROM "Event"
        WHERE "app_id" = ${id}
            AND "date" >= NOW() - INTERVAL '7 days'
        GROUP BY "browser"
        ORDER BY total_events DESC
        `;
    const browsershours: any[] = await prisma.$queryRaw`
        SELECT
            "browser" AS browser,
            COUNT(*) AS total_events,
            COUNT(DISTINCT "client_id") AS unique_visitors
        FROM "Event"
        WHERE "app_id" = ${id}
            AND "date" >= NOW() - INTERVAL '24 hours'
        GROUP BY "browser"
        ORDER BY total_events DESC
        `;

    const browsers = {
        hours24: browsershours.map(item => ({ browser: item.browser, total_events: Number(item.total_events), unique_visitors: Number(item.unique_visitors) })),
        week: browsersWeek.map(item => ({ browser: item.browser, total_events: Number(item.total_events), unique_visitors: Number(item.unique_visitors) })),
        month: browsersMonth.map(item => ({ browser: item.browser, total_events: Number(item.total_events), unique_visitors: Number(item.unique_visitors) }))
    }

    const osMonth: any[] = await prisma.$queryRaw`
        SELECT
            "os",
            COUNT(*) AS total_events,
            COUNT(DISTINCT "client_id") AS unique_visitors
        FROM "Event"
        WHERE "app_id" = ${id}
            AND "date" >= NOW() - INTERVAL '30 days'
        GROUP BY "os"
        ORDER BY total_events DESC
        `;

    const osWeek: any[] = await prisma.$queryRaw`
        SELECT
            "os",
            COUNT(*) AS total_events,
            COUNT(DISTINCT "client_id") AS unique_visitors
        FROM "Event"
        WHERE "app_id" = ${id}
            AND "date" >= NOW() - INTERVAL '7 days'
        GROUP BY "os"
        ORDER BY total_events DESC
        `;

    const osHours: any[] = await prisma.$queryRaw`
        SELECT
            "os",
            COUNT(*) AS total_events,
            COUNT(DISTINCT "client_id") AS unique_visitors
        FROM "Event"
        WHERE "app_id" = ${id}
            AND "date" >= NOW() - INTERVAL '24 hours'
        GROUP BY "os"
        ORDER BY total_events DESC
        `;

    const operatingSystems = {
        hours24: osHours.map(item => ({
            os: item.os,
            total_events: Number(item.total_events),
            unique_visitors: Number(item.unique_visitors)
        })),
        week: osWeek.map(item => ({
            os: item.os,
            total_events: Number(item.total_events),
            unique_visitors: Number(item.unique_visitors)
        })),
        month: osMonth.map(item => ({
            os: item.os,
            total_events: Number(item.total_events),
            unique_visitors: Number(item.unique_visitors)
        }))
    };



    return NextResponse.json({ project, visitors, views, onlineVisitors: Number(onlineVisitors[0].unique_clients), routes, countries , browsers , operatingSystems }, { status: 201 })
}