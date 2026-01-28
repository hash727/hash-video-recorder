import client from "@/lib/prisma"
import { clerkClient } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    req: NextRequest,
    { params }: {params: Promise<{id: string}>}
) {
    const { id } = await params;
    console.log("Endpoint Hit with ID:", id)
    try{
    const userProfile = await client.user.findUnique({
        where: {
            clerkid: id,
        },
        include: {
            studio: true,
            subscription: {
                select: {
                    plan: true,
                },
            },
        },
    })

    if(userProfile) return NextResponse.json({ status: 200, user: userProfile})

    // clerkClient in Clerk v4+ exports an already-instantiated client,
    // so just call clerkClient.users.getUser directly, not via property access.
    const clerkUserInstance = await (await clerkClient()).users.getUser(id)
    const createUser = await client.user.create({
        data: {
            clerkid: id,
            email: clerkUserInstance.emailAddresses[0]?.emailAddress,
            firstname: clerkUserInstance.firstName,
            lastname: clerkUserInstance.lastName,
            studio: {
                create: {},
            },
            WorkSpace: {
                create:{
                    name: `${clerkUserInstance.firstName}'s WorkSpace`,
                    type: 'PERSONAL',
                },
            },
            subscription: {
                create: {},
            },
        },
        include: {
            subscription: {
                select: {
                    plan: true,
                },
            },
        },
    })

    if(createUser) return NextResponse.json({ status: 201, user: createUser })
    return NextResponse.json({ status: 400 })
    }catch(error){
        console.log("Error", error)
        return NextResponse.json({ status: 500, error })
    }
}