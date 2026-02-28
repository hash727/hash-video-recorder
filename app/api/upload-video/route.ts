import { writeFile, mkdir } from 'fs/promises';
import { NextRequest, NextResponse} from 'next/server'
import path from 'path';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get('video') as Blob;
    const filename = formData.get('filename') as string;

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), 'temp_upload');

    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json({ status: 200 });
}