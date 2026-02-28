'use client'

import React, { useEffect, useRef, useState } from 'react'
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import axios from 'axios';
import { io, Socket } from "socket.io-client"
import { Input } from '@/components/ui/input';
// import { v4 as uuid } from 'uuid'


interface Props {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    workspaceId?: string;
}

const VideoUploadModal = ({ isOpen, onClose, userId, workspaceId }: Props) => {
    const socketRef = useRef<Socket | null>(null)
    const [status, setStatus] = useState<string>("");  
    const [loading, setLoading] = useState<boolean>(false);
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const ffmpegRef = useRef<any>(null);


    useEffect(() => {
        if(isOpen) {
            // connect to your backend socket server
            const socketUrL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"
            socketRef.current = io(socketUrL);

            socketRef.current.on("connect", () => {
                console.log("🟢 Socket connected:", socketRef.current?.id)
            });

            // cleanup: Disconnect when modal closes to save server resources
            return () => {
                if(socketRef.current){
                    socketRef.current.disconnect();
                    socketRef.current = null;
                    console.log("🔴 Socket disconnected")
                }
            }
        }
    },[isOpen])

    if(!isOpen) return null;

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        console.log(file);

        if(!file) return;

        if(file.size > 25 * 1024 * 1024) {
            alert("File exceeded 25MB limit");
            return;
        }

        setLoading(true);
        setStatus("🔧 Initializing...");

        try {
           
            if(ffmpegRef.current){
                await ffmpegRef.current.terminate();
            }

            const { FFmpeg } = await import('@ffmpeg/ffmpeg')
            const { fetchFile, toBlobURL } = await import('@ffmpeg/util')

            const ffmpeg = new FFmpeg();
            ffmpegRef.current = ffmpeg;

            
            // display frames
            ffmpeg.on('log', ({message}) => {
                console.log("🎬 FFmpeg Log:", message);
            })

            // const baseURL = "https://unpkg.com";
            const baseURL = `${window.location.origin}/ffmpeg`;

            // Pre-fetching to Blobs ensures the browser treats them correctly
            const [coreURL, wasmURL, workerURL]= await Promise.all([
                toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
                toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
                toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript"),
            ])

            await ffmpeg.load({
                coreURL,
                wasmURL,
                workerURL,
                // This is the critical fix for "too dynamic " errors
                // classWorkerURL: `${baseURL}/ffmpeg-worker.js`
            })
                

            setStatus("🎬 Converting to WebM...");
            try{

                await ffmpeg.deleteFile('input');
                await ffmpeg.deleteFile('output.webm')
            } catch(e){
                // if file doesnt' exist.
            }
            await ffmpeg.writeFile("input", await fetchFile(file))
            await ffmpeg.exec([
                        
                "-i", "input", 
                "-c:v", "libvpx",
                "-pix_fmt", "yuv420p",      // Standardizes color format for browsers
                "-cpu-used","5",
                // "-speed", "8",              // 8 is the fasterst/ lowest memory mode for vp8
                "-deadline", "realtime",    // Prevents deep buffering
                "-bufsize", "1000k",     //Limit the internal buffer size
                // "-crf","30",
                "-b:v", "1000k",
                "-vf", "scale=-2:480",      // Downscale to save memory
                "-c:a", "libvorbis",
                // "-preset", "ultrafast", 
                // "-threads","1",             //Keep at 1 if memory is the primary issue
                "output.webm"
            ]);

            const data = await ffmpeg.readFile("output.webm");

            const webmBlob = new Blob([new Uint8Array(data as Uint8Array).buffer], { type: "video/webm" });

            const filename = `${crypto.randomUUID()}.webm`;

            setStatus("📡 Streaming to server...");

            // --- CHUNKING LOGIC START ---
            const CHUNK_SIZE = 1024 * 512; // 512KB per chunk (stable for sockets)
            let offset = 0;

            while(offset < webmBlob.size) {
                const chunk = webmBlob.slice(offset, offset + CHUNK_SIZE);
                const buffer = await chunk.arrayBuffer();

                if(socketRef.current?.connected) {
                    // Emit each chunk to the 'video-chunks' listener on Express server
                    socketRef.current.emit("video-chunks" ,{
                        filename,
                        chunks: buffer, // The server recieves this as an Array Buffer
                    });

                    const progress = Math.round((offset / webmBlob.size) * 100);
                    setStatus(`🚀 Uploading: ${progress}%`)
                }

                offset += CHUNK_SIZE;
            }
            // --- CHUNKING LOGIC END ---

            setStatus("✅ Upload Complete. Processing...");

            console.log("Emitting with ID:", userId);

            // Notify server that the file is complete and ready for S3/AI
            socketRef.current?.emit("process-video",{
                filename,
                userId: userId
            });

            setIsFinished(true);
                        

        } catch (error) {
            console.error("Error uploading video:", error);
            setStatus("❌ Failed to upload video");
        } finally {
            // Kill the WASM instance to return memory to the browser
            if(ffmpegRef.current){
                await ffmpegRef.current.terminate();
                ffmpegRef.current = null;
            }
            setLoading(false);
        }
        
    }
    return (
    <div className ="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className='bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-300'>
            <button onClick={onClose} className='absolute top-4 right-4 text-gray-400 hover:text-black'>
                ✕
            </button>

            <h2 className='text-2xl font-bold mb-4'>Upload Video</h2>

            {!isFinished ? (
                <div className='space-y-4'>
                    <Input 
                        type='file'
                        accept='video/*'
                        onChange={handleUpload}
                        disabled={loading}
                        className='w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700'
                    />
                    {status && <p className='text-center text-blue-600 font-medium'>{status}</p>}
                </div>
            ) : (
                <div className='text-center space-y-4'>
                    <div className='text-5xl text-green-500'>
                        🎉
                    </div>
                    <p className='font-semibold'>{status}</p>
                    <button
                        onClick={onClose}
                        className='w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800'
                    >
                        Close
                    </button>
                </div>
            )}
        </div>

    </div>
  )
}

export default VideoUploadModal