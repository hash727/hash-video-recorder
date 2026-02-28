import React, { useRef, useState } from 'react'
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000');


const useRecorder = ( userId: string) => {
    const [isRecording, setIsRecording] = useState(false)
    const [ videoId, setVideoId] = useState<string | null>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)

    const startRecording = async () => {
        try {
            // Capture screen and audio
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true, 
                audio: true
            });
    
            // Generate a unique filename/ID for this session
            const filename = `${Date.now()}-${userId}.webm`;
            setVideoId(filename);

            // Initialize mimeType codec
            const mimeType = MediaRecorder.isTypeSupported('video/webm; codecs=vp9')
                             ? 'video/webm; codecs=vp9'
                             : 'vide/webm'
            // Initialize MediaRecorder with specific codec to match backend
            const recorder = new MediaRecorder(stream, { mimeType });

            mediaRecorderRef.current = recorder;

            // Handle chunks: Send to backend every 1 second
            recorder.ondataavailable = async (event) => {
                if(event.data && event.data.size > 0) {
                    const arrayBuffer = await event.data.arrayBuffer();
                    // Match backend socket.on('video-chunks')
                    socket.emit('video-chunks', {
                        filename: filename,
                        chunks: arrayBuffer, 
                    })
                }
            }

            // start recording in 1-second slices
            recorder.start(1000);
            setIsRecording(true);

            // Auto-stop when user clicks "stop sharing" browser button
            stream.getVideoTracks()[0].onended = () => stopRecording(filename)
            
        } catch (error) {
            console.error('Error starting recording:', error)
        }
    }

    const stopRecording = (filename: string) => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
            
            // Matches your backend socket.on('process-video')
            socket.emit('process-video', {
                filename: filename,
                userId: userId,
            });

            setIsRecording(false);
            setVideoId(null);
        }
    };

    return { startRecording, stopRecording: () => videoId && stopRecording(videoId), isRecording };
}

export default useRecorder