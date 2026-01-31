
import { NextResponse } from "next/server";
import client from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const user = await currentUser();

    if(!user) return { status: 404 }

    const  query = searchParams.get('q');

    if(!query) return NextResponse.json([]);

    const users = await client?.user.findMany({
        where: {
            OR:[
                { firstname: { contains: query } }, 
                {email: { contains: query}}, 
                { lastname: { contains: query }}],
            NOT:[{ clerkid: user.id}],
        },
        select:{
            id: true,
            firstname: true,
            lastname: true,
            image:true,
            email:true
        },
        take: 5, // limit results for performance
    });

    return NextResponse.json(users)
}