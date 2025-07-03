import { NextResponse } from "next/server";
import { prisma } from "@workspace/db";

export async function POST(request: Request) {
    const body = await request.json();
    const id = body.id;
    const existingPicture = await prisma.picture.findUnique({
        where: {
            id: id,
        },
    });
    if (!existingPicture) {
        return NextResponse.json({ error: "Picture not found" }, { status: 404 });
    }
    const updatedPicture = await prisma.picture.update({
        where: {
            id: id,
        },
        data: {
            is_verified: false,
        },
    });
    return NextResponse.json(updatedPicture)
}