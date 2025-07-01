import { NextResponse } from "next/server";
import { prisma } from "@workspace/db";

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const id = params.id;
    const existingReview = await prisma.review.findUnique({
        where: {
            id: id,
        },
    });
    if (!existingReview) {
        return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    const updatedReview = await prisma.review.update({
        where: {
            id: id,
        },
        data: {
            is_verified: false,
        },
    });
    return NextResponse.json(updatedReview)
}