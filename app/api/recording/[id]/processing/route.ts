import client from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";

import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    {
        params,
    }: {
        params: Promise<{ id: string }>
    }
){

    try {
        const body = await req.json()
        const {id} = await params

        console.log(`Body: ${body.filename} <<<>>> id: ${id}`)

        const personalworkspaceId = await client.user.findUnique({
            where: {
                id,
            },
            select:{
                WorkSpace:{
                    where:{
                        type: 'PERSONAL',
                    },
                    select: {
                        id: true,
                        folders: true,
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        })

        // 1. Safety check: Ensure workspace exists before updating
        if (!personalworkspaceId?.WorkSpace?.[0]?.id) {
            return NextResponse.json({ status: 404, message: "Workspace not found" }, { status: 404 });
        }



        const startProcessingVideo = await client.workSpace.update({
            where: {
                id: personalworkspaceId?.WorkSpace[0].id,
            },
            data: {
                videos: {
                    // create: {
                    //     source: body.filename,
                    //     userId: id,
                    // },
                    upsert: {
                        where: { source: body.filename},
                        update: { source: body.filename},
                        create: {
                            source: body.filename,
                            folderId: personalworkspaceId?.WorkSpace[0].folders[0].id,
                            userId: id,
                        }
                    }
                },
            },
            select: {
                User: {
                    select: {
                        subscription: {
                            select: {
                                plan: true,
                            },
                        },
                    },
                },
            },
        })

        if(startProcessingVideo){
            return NextResponse.json({
                status: 200,
                plan: startProcessingVideo.User?.subscription?.plan,
            })
        }
        return NextResponse.json({ status: 400 })
    } catch (error) {
        console.log("Error in processing video", error)
        if(error instanceof Prisma.PrismaClientKnownRequestError ){
            if(error.code === 'P2002'){
                return NextResponse.json({message: 'This Video filename already exists !'})
            }
        }
        // 2. REQUIRED: Always return a response in the catch block
        return NextResponse.json(
            { status: 500, message: "Internal Server Error" },
            { status: 500 }
        );
    }
    
}