import client from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }>}
){
    try{

        const { id } = await params
        const body = await req.json()
        
        const completeProcessing = await client.video.update({
            where:{
                userId: id,
                source: body.filename,
            },
            data: {
                processing: false,
            },
        })
    
        return NextResponse.json({ status: 200, data: completeProcessing })
        
        
    } catch (error: any){

        console.error("❌ Complete API Error:", error.message);
        return NextResponse.json({ status: 500, error: error.message }, { status: 500 })
    }


}