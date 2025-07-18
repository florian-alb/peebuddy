import { NextResponse } from "next/server";
import { prisma } from "@workspace/db";

export async function POST(request: Request) {
    const body = await request.json();
    const id = body.id;
    const existingToilet = await prisma.toilet.findUnique({
        where: {
            id: id,
        },
    });
    if (!existingToilet) {
        return NextResponse.json({ error: "Toilet not found" }, { status: 404 });
    }
    const updatedToilet = await prisma.toilet.update({
        where: {
            id: id,
        },
        data: {
            is_verified: false,
        },
    });
    return NextResponse.json(updatedToilet)
}