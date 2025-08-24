import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";


export async function GET(req: NextRequest) {
    const session = await auth()

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }


    const projects = await prisma.app.findMany({ where: { user_id: session.user.id } })

    return NextResponse.json({ projects }, { status: 201 })
}