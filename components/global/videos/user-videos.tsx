'use client'

import { getAllUserVideos } from '@/actions/workspace'
import { useQueryData } from '@/hooks/useQueryData'
import { VideosProps } from '@/types/type'
import { Loader2, VideoIcon } from 'lucide-react'
import React from 'react'
import VideoCard from './video-card'
import { cn } from '@/lib/utils'

type Props = {
    folderId?: string
    videosKey: string
    workspaceId: string
}


const UserVideos = ({ folderId, videosKey, workspaceId }: Props) => {

    // console.log(folderId,"-",videosKey,"-",workspaceId)
    
    const { 
        data: videoData,
        isFetching,
     } = useQueryData(
        [videosKey, workspaceId], 
        () => getAllUserVideos(workspaceId)
    )

    if(isFetching){
        return(
            <div className='flex items-center justify-center p-8'>
                <Loader2 className='h-6 w-6 animate-spin text-neutral-400' />
                <span className='ml-2 text-neutral-400'>Loading Videos...</span>
            </div>
        )
    }
    const { status: videosStatus, data: videos } = videoData as VideosProps
  return (
    <div className='flex flex-col gap-4 mt-4'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
                <VideoIcon />
                <h2 className='text-[#BDBDBD] text-xl'>Videos</h2>
            </div>
        </div>
        <section className={cn(videosStatus !== 200 ? 'p-5' : 'grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5')}>
            {videosStatus === 200 && Array.isArray(videos) ? (
              videos.map((video: any) => (
                <VideoCard 
                  key={video.id}
                  workspaceId={workspaceId}
                  {...video}
                />
              )
            )) : (
                <p className='text-[#BDBDBD]'>No Videos in WorkSpace</p>
            )}
        </section>
        {/* <VideoCard workspaceId={workspaceId} {...video[0]} /> */}
    </div>
  )
}

export default UserVideos