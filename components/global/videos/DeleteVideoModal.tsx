'use client'
import React, { useEffect, useState } from 'react'
import {io, Socket} from 'socket.io-client'
import{
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Loader2, Trash2 } from 'lucide-react'

interface Props {
    isOpen: boolean
    onClose: () => void
    videoId: string
    filename: string
    userId: string
}

const DeleteVideoModal = ({ isOpen, onClose, videoId, filename, userId}: Props) => {
    const [loading, setLoading] = useState(false)
    const [socket, setSocket] = useState<Socket | null>(null)

    useEffect(() => {
        if(isOpen){
            const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"
            const newSocket = io(socketUrl)
            setSocket(newSocket)

            newSocket.on('video-deleted', (res) => {
                setLoading(false)
                if(res.success){

                    onClose()
                    window.location.reload() // Refresh to update
                }else{
                    alert("Error: "+ res.error)
                }
            })

            return () => {
                newSocket.disconnect()
            }
        }
    }, [isOpen, onClose])

    const handleDelete = () => {
        if(socket && socket.connected) {
            setLoading(true)
            // Emit the event we setup in the express server
            socket.emit('delete-video', {
                videoId,
                filename,
                userId
            })
        }
    }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='bg-[#111111] border-neutral-800 text-white'>
            <DialogHeader>
                <DialogTitle className='flex items-center gap-2 text-red-500'>
                    <Trash2 size={20} /> Confirm Deletion
                </DialogTitle>
                <DialogDescription className='text-neutral-400'>
                    This action cannot be undone. This will permanently delete the video <span className='text-white font-mono block mt-1'>{filename}</span> from our servers and your workspace
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className='mt-4'>
                <Button
                    variant={'ghost'}
                    onClick={onClose}
                    disabled={loading}
                    className='hover:bg-neutral-800 text-white'
                >
                    cancel
                </Button>
                <Button
                    variant={'destructive'}
                    onClick={handleDelete}
                    disabled={loading}
                    className='bg-red-600 hover:bg-red-700'
                >
                    {loading? <Loader2 className='animate-spin' /> : "Delete Permanently"}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default DeleteVideoModal