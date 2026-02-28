import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import useRecorder from '@/hooks/use-recorder'
import { Circle, StopCircle, Video } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'



const RecordingModal = ({ userId }: { userId: string}) => {
    
    const { startRecording, stopRecording, isRecording} = useRecorder(userId)
    const webcamVideoRef = useRef<HTMLVideoElement>(null);
    const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null)

    // Request Webcam when Modal opens or Recording starts
    const setupWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false  // Audio is usually handled by the screen share start
            });
            setWebcamStream(stream);
            if(webcamVideoRef.current){
                webcamVideoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error("Webcam access denied", error)
        }
    };

    useEffect(() => {
        return () => {
            webcamStream?.getTracks().forEach(track => track.stop());
        }
    }, [webcamStream])
  return (
    <Dialog onOpenChange={(open) => open && setupWebcam()}>
        <DialogTrigger asChild>
            <Button variant={'outline'} className='flex gap-2'>
                <Video size={16} />
                <span>Record</span>
            </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[600px] bg-[#111111] border-neutral-800'>
            <DialogHeader>
                <DialogTitle className='text-white'>Video Recorder</DialogTitle>
            </DialogHeader>

            <div className='relative aspect-video w-full bg-black rounded-lg overflow-hidden border border-neutral-700'>
                {/* Main Preview Placeholder (The screen) */}
                <div className='absolute inset-0 flex items-center justify-center text-neutral-500'>
                    {isRecording ? "Recording Screen..." : "Ready to capture"}
                </div>

                {/* Tiny Webcam Bubble (Picutre-in-Picture) */}
                <div className='absolute bottom-4 right-4 w-32 h-32 rounded-full border-2 border-blue-500 overflow-hidden bg-neutral-900 shadow-2xl'>
                    <video
                        ref={webcamVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className='w-full h-full object-cover mirror'
                    />
                </div>
            </div>

            <div className='flex justify-center mt-4'>
                {!isRecording ? (
                    <Button
                        onClick={startRecording}
                        className='bg-blue-600 hover:bg-blue-700 text-white w-full py-6 flex gap-2'
                    >
                        <Circle className='fill-red-500 text-red-500' size={16} />
                        Start Recording
                    </Button>
                ) : (
                    <Button
                        onClick={stopRecording}
                        className='bg-red-600 hover:bg-red-700 text-white w-full py-6 flex gap-2'
                    >
                        <StopCircle size={16} />
                        Stop & Save
                    </Button>
                )}
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default RecordingModal