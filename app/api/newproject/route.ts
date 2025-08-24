import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";


export async function POST(req: NextRequest) {
    const data = await req.json()
    const session = await auth()

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!data) {
        return NextResponse.json({ error: "No data" }, { status: 400 })
    }

    if (!data.name || !data.origin) {
        return NextResponse.json({ error: "Please fill all the fields" }, { status: 400 })
    }

    const [newRecord, allRecords] = await prisma.$transaction([
        prisma.app.create({
            data: { name: data.name, origin: data.origin , user_id: session.user.id },
        }),
        prisma.app.findMany(),
    ]);

    return NextResponse.json({ allRecords }, { status: 201 })
}