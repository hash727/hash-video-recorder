import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest, 
    { params } : {params: Promise<{ key: string }>
}){
    
    try {
        const { key } = await params;

        const baseUrl = process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL;
        if(!baseUrl) throw new Error("CloudFront URL is missing in .env")

        const cloudFrontUrl = `${baseUrl}/${key}`;

        const range = request.headers.get('range') || 'bytes=0-';

        const response = await fetch(cloudFrontUrl, {
            // Forward Range headers for seeking (fast forward/rewind)
            headers: {
                'Range': range,
            }
        });

        const responseHeaders = new Headers(response.headers);
        responseHeaders.set('Content-Type', 'video/webm');
        responseHeaders.set('Cross-Origin-Resource-Policy', 'cross-origin');
        responseHeaders.set('Accept-Ranges', 'bytes');
        responseHeaders.set('Content-Range', response.headers.get('Content-Range') || '');
        responseHeaders.set('Cache-Control', 'public, max-age=3600');

        // Create a new response with the video stream
        const proxiedResponse = new NextResponse(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
        });

        return proxiedResponse;
        
    } catch (error: any) {
        console.error("Internal Server Error:", error.message)
        return NextResponse.json({error: error.message}, { status: 500})
    }


    // Forward the video stream with standard headers

    // return new NextResponse(response.body, {
    //     headers: {
    //         'Content-Type' : 'video/webm',
    //         'Cross-Origin-Resource-Policy': 'cross-origin',
    //     },
    // });
}