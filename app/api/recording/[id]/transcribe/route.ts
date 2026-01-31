import client from "@/lib/prisma";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest, 
    {params}: {params: Promise<{id: string}>}
){

    // WIRE UP AI AGENT
    const body = await req.json()
    const { id } = await params

    const content = JSON.parse(body.content)

    console.log("Content: >>> ", content)

    const transcribed = await client.video.update({
        where: {
            userId: id,
            source: body.filename,
        },
        data: {
            title: content.title,
            description: content.summary,
            summery: body.transcript,
        },
    })
    if(transcribed){
        console.log('Transcribed, storing in kb')
        try {
            
        const options = {
            method: 'POST',
            url: process.env.VOICEFLOW_KNOWLEDGE_BASE_API,
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: process.env.VOICEFLOW_API_KEY,

            },
            data: {
                data: {
                    name: content.title || 'Untitled Document',
                    schema: {
                        searchableFields: ['title', 'transcript'],
                        metadataFields: ['title', 'transcript'],
                    },
                    items: [
                        {
                            title: content.title,
                            transcript: body.transcript,
                        },
                    ],
                },
            },
        }

        const updateKB = await axios.request(options)

        
        console.log(updateKB.data)
        return NextResponse.json({ status: 200 })
    } catch (error: any) {
        console.error('Voiceflow API Error:', error?.response?.data || error?.message || error);
        return NextResponse.json(
            { error: 'Failed to update Knowledge Base', details: error?.response?.data || error?.message || String(error) },
            { status: 500 }
        );
    }
        
        
    }

    console.log(' Transcription went wrong')
    return NextResponse.json({ status: 400 })

}