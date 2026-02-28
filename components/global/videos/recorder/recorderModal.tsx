'use client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { CameraOff, Circle, FlipHorizontal, Loader2, Mic, MicOff, RefreshCw, StopCircle, Video } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { toast } from 'sonner'



const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL) || "http://localhost:5000"

interface Props {
    userId: string;
    profilePic?: string; // Pass the user's Profile 
}

const RecorderModal = ({userId, profilePic}: Props) => {
    
    const [isRecording, setIsRecording] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [videoId, setVideoId] = useState<string | null>(null)
    const [timer, setTimer] = useState(0); // Timer state in seconds
    const [isMirrored, setIsMirrored] = useState(true); //Mirror state
    const [isMuted, setIsMuted] = useState(false); // New Mute state
    const [hasWebcam, setHasWebcam] = useState(true)

    // Refs for streams and hidden processing elements
    const screenVideoRef = useRef<HTMLVideoElement | null>(null)
    const webcamVideoRef = useRef<HTMLVideoElement | null>(null)
    const profileImgRef = useRef<HTMLImageElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const requestRef = useRef<number>(null);
    const recordedChunks = useRef<Blob[]>([]) // Store chunks for local download

    // 1. Setup Preview (Runs when modal opens)
    const setupPreview = async () => {
        try{
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoExists = devices.some(d => d.kind === 'videoinput');
            setHasWebcam(videoExists);

            // Attempt to get webcam if it exists
            if(videoExists){
                const camStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                })
                if (webcamVideoRef.current) webcamVideoRef.current.srcObject = camStream;
                await webcamVideoRef.current?.play();
            }
        } catch (e) { setHasWebcam(false); }
    }
    // Clean up streams when modal closes
    const closeStreams = () => {
        [screenVideoRef, webcamVideoRef].forEach(ref => {
            const stream = ref.current?.srcObject as MediaStream;
            stream?.getTracks().forEach(t => t.stop());
        });
        cancelAnimationFrame(requestRef.current!)
    }
    // Check for webcam on mount or when modal opens
    const checkHardware = async () => {
        try{
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoExists = devices.some(device => device.kind === 'videoinput');
            setHasWebcam(videoExists);
            return videoExists;
        } catch (e) { 
            setHasWebcam(false); 
            return false;
        }
    };

    // Pre-Load profile pic if provided
    useEffect(() => {
        if(profilePic){
            const img = new Image();
            img.src = profilePic as string;
            img.crossOrigin = "anonymous"
            profileImgRef.current = img;
        }
        checkHardware();
    }, [profilePic])


    // Format seconds into 00:00
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if(isRecording){
            interval = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
        }else {
            setTimer(0);
        }
        return () => clearInterval(interval)
    }, [isRecording]);

    const startRecording = async () => {

        try {
                        
            console.log("Requesting streams...")
            // setDownloadUrl(null);
            // recordedChunks.current = []; 

            // Request Screen separately to avoid NotFoundError on camera
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            })
            if(screenVideoRef.current) screenVideoRef.current.srcObject = screenStream
            await screenVideoRef.current?.play();

            // // Setup Canvas for Merging
            const canvas = canvasRef.current!;
            const ctx = canvas.getContext('2d')!;
            canvas.width = 1280; // Standard HD
            canvas.height = 720;

            const drawFrame = () => {
                // Draw Screen (Background)
                ctx.drawImage(screenVideoRef.current!, 0, 0, canvas.width, canvas.height);

                // Draw Webcam (Pip Circle / Square)
                const camSize = 180;
                const margin = 30;
                const x = canvas.width - camSize - margin;
                const y = canvas.height - camSize - margin;

                ctx.save();
                ctx.beginPath();
                ctx.arc(x + camSize/2, y + camSize/2, camSize/2, 0, Math.PI * 2)
                ctx.clip();

                if(hasWebcam && webcamVideoRef.current?.srcObject){                    
                    if(isMirrored){
                        // mirro logic
                        ctx.translate( x + camSize, y);
                        ctx.scale( -1, 1);
                        ctx.drawImage(webcamVideoRef.current!, 0, 0, camSize, camSize);
                        
                    } else {
                        ctx.drawImage(webcamVideoRef.current!, x, y, camSize, camSize);
                    }
                } else if (profileImgRef.current) {
                    // draw profile pic fallback
                    ctx.drawImage(profileImgRef.current, x, y, camSize, camSize);
                } else {
                    // Solid color fallback with User Icon if no image at all
                    ctx.fillStyle = "#262626";
                    ctx.fill();
                }

                // ctx.drawImage(webcamVideoRef.current!, canvas.width - camSize - 20, canvas.height - camSize - 20, camSize, camSize);
                ctx.restore();

                requestRef.current = requestAnimationFrame(drawFrame);

            };

            const filename = `${Date.now()}-${userId}.webm`
            // Combine Canvas Video + Webcam Audio
            const canvasStream = canvas.captureStream(30);
            const userAudio = (webcamVideoRef.current?.srcObject as MediaStream)?.getAudioTracks() || [];
            const combinedStream = new MediaStream([
                ...canvasStream.getVideoTracks(),
                ...userAudio // Capture your voice
            ]);

            setVideoId(filename);

            const mimeType = MediaRecorder.isTypeSupported('video/webm; codecs=vp9')
                             ? 'video/webm; codecs=vp9'
                             : 'vide/webm'
            const recorder = new MediaRecorder(combinedStream, { mimeType });

            mediaRecorderRef.current = recorder;
            recordedChunks.current = [];

            recorder.ondataavailable = async (e) => {
                if(e.data.size > 0){
                    socket.emit('video-chunks', {
                        filename,
                        chunks: await e.data.arrayBuffer()
                    });

                    // Keep a local copy for the dowload preview
                    recordedChunks.current.push(e.data);
                }
            };

            recorder.onstop = () => {
                setIsProcessing(true); // start Processing overlay
                // Create the local download URL when finished
                const fullBlob = new Blob(recordedChunks.current, { type: 'video/webm'})
                const url = URL.createObjectURL(fullBlob);
                setDownloadUrl(url);
                socket.emit('process-video', {filename, userId});

                // Listener for server completion (example event)
                socket.once('video-processed', (response) => {
                    setIsProcessing(false);
                    if(response.success){

                        toast.success("Video processed successfully!")
                    } else {
                        toast.error("Database update failed, but video was uploaded.")
                    }
                });

                // Fallback: if no rsponse in 30 seconds, force close the overlay
                setTimeout(() => {
                    if(isProcessing){
                        setIsProcessing(false);
                        toast.error("Processing is taking longer than expected. Check your dashboard")
                    }
                }, 30000)
            };


            mediaRecorderRef.current = recorder;
            recorder.start(1000);
            setIsRecording(true);
            drawFrame(); // Start canvas loop
            // Toast Notification
            toast.success("Recording started", {
                description: "Your screen is now being captured",
                duration: 3000,
            });

        } catch (error: any) {
            console.error("Capture failed", error)
            toast.error("Recording failed", {
                description: error.name === "NotAllowedError" ? "Permission denied by user." : "Could not access hardware.",
            })
        }
    }

  return (
    <Dialog onOpenChange={(open) => open && checkHardware()}>
        <DialogTrigger asChild>
            <Button 
                variant={'outline'}
                disabled={!userId}
            >
                <Video size={16} className='mr-2'/>
                Record
            </Button>
        </DialogTrigger>
        <DialogContent className='bg-[#111111] border-none text-white sm:max-w-[700px]'>
            {/* PROCESSING OVERLAY */}
            {isProcessing && (
                <div className='absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md'>
                    <Loader2 className='w-12 h-12 text-blue-500 animate-spin mb-4' />
                    <h2 className='text-xl font-bold'>Processing Video ...</h2>
                    <p className='text-neutral-400 text-sm'>Uploading and generating AI transcription.</p>
                </div>
            )}

            <DialogHeader>
                <DialogTitle className='flex items-center justify-between' >
                    <span className='flex items-center gap-2'><Video size={18} /> HasH Studio</span>
                    {isRecording && (
                        <div className='flex items-center gap-3 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20'>
                            <div className='w-2 h-2 bg-red-500 rounded-full animate-pulse' />
                            <span className='text-white text-sm font-mono'>{formatTime(timer)}</span>
                        </div>
                    )}
                </DialogTitle>
            </DialogHeader>

            {/* WEBCAM NOT FOUND WARNING */}
            {!hasWebcam && !isRecording && (
                <Alert variant="destructive" className="bg-amber-500/10 border-amber-500/20 flex items-center justify-between">
                    <div className='flex items-center gap-2'>
                        <CameraOff className="h-4 w-4 text-amber-500" />
                        <AlertTitle className="text-xs font-bold">Webcam Not Found</AlertTitle>
                        <AlertDescription className="text-[11px] opacity-80">
                            No camera detected. Your profile picture will be shown in the recording instead.
                        </AlertDescription>
                        <Button
                            variant={'ghost'}
                            size={'sm'}
                            onClick={checkHardware}
                            className='h-7 hover:bg-amber-500/20'
                        >
                            <RefreshCw size={12} />
                        </Button>
                    </div>
            </Alert>
            )}

            {/* Hidden processing elements */}
            {/* <div className='relative aspect-video bg-black rounded-lg border border-white/10 overflow-hidden'>
                <canvas ref={canvasRef} className='w-full h-full object-contain' />
                <video ref={screenVideoRef} className='hidden' muted />
                <video ref={webcamVideoRef} className='hidden' muted />
            </div> */}

            {/* Visual Feedback for User */}
            <div className='relative rounded-lg overflow-hidden border border-white/10 aspect-video bg-black'>
                {/* <canvas ref={canvasRef} className='w-full h-full object-contain' /> */}
                <canvas ref={canvasRef} className='w-full h-full object-contain' />
                <video ref={screenVideoRef} className='hidden' muted />
                <video ref={webcamVideoRef} className='hidden' muted />

                {/* overlay badge inside the canvas area for better UX */}
                {/* Floating settings panel */}
                {!isRecording && !downloadUrl && (
                    // <div className='absolute inset-0 flax items-center justify-center bg-black/40 backdrop-blur-sm'>
                    //     <p className="text-neutral-400 text-sm">Permissions required for Screen & Camera</p>
                    // </div>
                    <div className='absolute top-4 righ-4 flex flex-col gap-2'>

                        <div className="flex items-center justify-between gap-4 bg-black/60 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10">
                            <div className='flex items-center gap-2'>

                                <FlipHorizontal size={14} className="text-neutral-400" />
                                <Label htmlFor="mirror-mode" className="text-[10px] uppercase font-bold tracking-widest text-neutral-300">Mirror</Label>
                            </div>
                            <Switch 
                                id="mirror-mode" 
                                checked={isMirrored} 
                                onCheckedChange={setIsMirrored} 
                            />
                        </div>

                        <div className="flex items-center justify-between gap-4 bg-black/60 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10">
                        <div className="flex items-center gap-2">
                                    {isMuted ? <MicOff size={14} className="text-red-400" /> : <Mic size={14} className="text-neutral-400" />}
                                    <Label className="text-[10px] uppercase font-bold tracking-widest text-neutral-300">Mute</Label>
                                </div>
                                <Switch checked={isMuted} onCheckedChange={setIsMuted} />
                        </div>
                    </div>
                )}
            </div>

            <div className='flex flex-col gap-3 mt-4'>

                <Button
                    onClick={isRecording ? () => mediaRecorderRef.current?.stop() : startRecording}
                    className={`w-full py-6 font-bold transition-all duration-300 mt-4 ${
                        isRecording 
                        ? 'bg-red-600 hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.3)]' 
                        : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isRecording ? <StopCircle className='animate-pulse' /> : <Circle />}
                        {isRecording ? "Recording..." : "Start Recording"}
                </Button>
                {/* download preview */}
                {downloadUrl && (
                    <div className='flex flex-col gap-2 mt-4'>
                        <p className='text-xs text-center text-neutral-400'>
                            Recording finished! You can preview it locally or find it in your dashboard soon.
                        </p>
                        <div className='flex gap-2'>
                            {/* Download Link */}
                            <Button asChild variant={'secondary'} className='flex-1 py-6'>
                                <a href={downloadUrl} download={`prefiew-${Date.now()}.webm`}>
                                    Download Preview
                                </a>
                            </Button>

                            {/* Preview Playback (Optional) */}
                            <Button
                                variant={'outline'}
                                className='flex-1 py-6'
                                onClick={() => window.open(downloadUrl,'_blank')}
                                >
                                Watch Preview
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default RecorderModal