import { NextResponse } from "next/server";
import { prisma } from "@workspace/db";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
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