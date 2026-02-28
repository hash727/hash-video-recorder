import client from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
    req: NextRequest,
    { params } : { params: Promise<{ id: string}>}
){
    try{
        const { id } = await params;
        const { videoId } = await req.json();

        console.log("userId:",id, " videoId", videoId)
        const deletedVideo = await client.video.deleteMany({
            where: {
                id: videoId, // primay key elementis unique.
                // userId: id,
                User:{
                    id: id
                },
            },
        });

        if(deletedVideo.count === 0) {
            return NextResponse.json({
                status: 404,
                message: "Record not found in DB"
            })
        }

        return NextResponse.json({
            status: 200,
            message: "Record deleted",
            data: deletedVideo
        });
    } catch(error: any){
        console.error("Prisma Delete Error: ", error.message);
        return NextResponse.json(
            {status: 500, message: "Internal Server Error"},
            {status: 500}
        );
    }
}