import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
    const { slug } = params;
    console.log("🚀 ~ GET ~ slug:", slug);
    try {
        const post = await prisma.post.findUnique({
            where: { slug },
            include: { user: true },
        });

        if (post) {
            console.log("🚀 ~ GET ~ post:", post);
            await prisma.post.update({
                where: { slug },
                data: { views: { increment: 1 } },
            });
        }

        return new NextResponse(JSON.stringify(post, { status: 200 }));
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify(
                { message: "Something went wrong!" },
                { status: 500 }
            )
        );
    }
};
