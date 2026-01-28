'use client'
import React, { useRef } from 'react'
import Loader from '../loader/loader'
import CardMenu from './video-car-menu'
import ChangeVideoLocation from '@/components/forms/change-video-location/changeVideoLocation'
import CopyLink from './copy-link'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { Dot, Share2, User2 } from 'lucide-react'

type Props = {
    User: {
        firstname: string | null
        lastname: string | null
        image: string | null
    } | null
    id: string
    Folder: {
        id: string
        name: string
    } | null
    createdAt: Date
    title: string | null
    source: string
    processing: boolean
    workspaceId: string
}

const VideoCard = (props: Props) => {
    // wire up date 
    const daysAgo = Math.floor(
        (new Date().getTime() - props.createdAt.getTime()) / (24 * 60 * 60 * 1000)
    )

    const videoRef = useRef(null);

    const videoElement = videoRef.current as HTMLVideoElement | null;
    const handleMouseEnter = () => {
        // Play the video when the mouse enters
        videoElement?.play().catch((err: unknown) => console.error("play back Error", err));
    }

    const handleMouseLeave = () => {
        // Pause and optionally reset the video when the mouse leaves
        videoElement?.pause();
    }
    
    // console.log(props)
  return (
    <Loader 
        state={props.processing}
        className='bg-[#171717] flex justify-center items-center border border-[#252525] rounded-xl'
    >
        <div className=' group overflow-hidden cursor-pointer bg-[#171717] relative border border-[#252525] flex flex-col rounded-xl'>
            <div className='absolute top-3 right-3 z-50 flex-col gap-y-3 items-center hidden group-hover:flex'>
                <CardMenu 
                    currentFolderName={props.Folder?.name}
                    videoId={props.id}
                    currentWorkSpace={props.workspaceId}
                    currentFolder={props.Folder?.id}
                />
                <CopyLink 
                    
                    className='p-0 h-5 bg-[#252525] hover:bg-transparent' 
                    videoId={props.id} 
                />
            </div>
            <Link 
                href={`/dashboard/${props.workspaceId}/video/${props.id}`}
                className='hover:bg-[#252525] transition duration-150 flex flex-col justify-between h-full'
            >
                <video
                    ref={videoRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    controls={false}
                    preload='metadata'
                    muted
                    playsInline
                    className='w-full aspect-video opacity-50 z-20'
                >
                    <source
                        src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${props.source}#t=1`}
                    />
                </video>
                <div className="px-5 py-3 flex flex-col gap-7-2 z-20">
                    <h2 className='text-sm font-semibold text-[#BDBDBD]'>
                        {props.title}
                    </h2>
                    <div className='flex gap-x-2 items-center mt-4'>
                        <Avatar className=' w-8 h-8'>
                            <AvatarImage src={props.User?.image as string} />
                            <AvatarFallback>
                                <User2 />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className='capitalize text-[#6b6b6b] text-xs'>
                                {props.User?.firstname} {props.User?.lastname}
                            </p>
                            <p className='text-[#707070] text-xs flex items-center'>
                                <Dot /> {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
                            </p>
                        </div>
                    </div>
                    <div className='mt-4'>
                        <span className='flex gap-x-1 items-center'>
                            <Share2
                                fill='#9D9D9D'
                                className='text-[#9D9D9D]'
                                size={12}
                            />
                            <p className='text-sm font-semibold text-[#BDBDBD]'>
                                {props.User?.firstname}'s Workspace
                            </p>
                        </span>
                    </div>
                </div>
            </Link>
            
        </div>

        {/* <ChangeVideoLocation
            currentFolder={props.Folder?.name}
            currentWorkSpace={props.id}
            videoId={props.workspaceId}
            currentFolderName={props.Folder?.id}

        /> */}
    </Loader>
  )
}

export default VideoCard