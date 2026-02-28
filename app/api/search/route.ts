
import { NextResponse } from "next/server";
import client from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const user = await currentUser();

    if(!user) return { status: 404 }

    const  query = searchParams.get('q');

    if(!query) return NextResponse.json([]);

    const [users, workspaces] = await Promise.all([
    
        client?.user.findMany({
            where: {
                OR:[
                    { firstname: { contains: query , mode: 'insensitive'} }, 
                    { email: { contains: query, mode: 'insensitive'}}, 
                    { lastname: { contains: query ,mode: 'insensitive'}}],
                    
                NOT:[{ clerkid: user.id}],
            },
            select:{
                id: true,
                firstname: true,
                lastname: true,
                image:true,
                email:true,
                subscription:{
                    select:{
                        plan: true,
                    }
                },
                _count:{
                    select:{
                        WorkSpace:true,
                        videos:true,
                        members:true,
                        notification:true
                    }
                }
            },
            take: 5, // limit results for performance
        }),

        client?.workSpace.findMany({
            where: {
                name: { contains: query, mode: 'insensitive'},
                
                NOT:[
                        { type: 'PERSONAL'},
                        {
                            // Exclude workspaces where the owner is the current user
                            User: {
                                clerkid: {
                                    equals:user.id
                                }
                            }
                        }
                    ]
            },
            select: {
                id:true,
                name: true,
                User: {
                    select:{
                        id: true,
                        firstname: true,
                        lastname: true,
                        image: true,
                        email: true,
                    },
                },
                _count: {
                    select: {
                        folders: true,
                        videos: true,
                        members: true,
                    },
                },
            
            },
            take: 5,
        })
    ])

    console.log("********************************")
    console.log("User: ", users)
    console.log("WorkSpaces: ", workspaces)
    console.log("********************************")

    // return NextResponse.json([users, worksapces])
    return NextResponse.json({
        status: 200,
        users: users ?? [],
        workspaces: workspaces ?? []
    })
}