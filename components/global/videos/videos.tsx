'use client'

import { getAllUserVideos } from '@/actions/workspace'
import { useQueryData } from '@/hooks/useQueryData'
import { VideosProps } from '@/types/type'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Loader2, VideoIcon } from 'lucide-react'
import React, { useState } from 'react'
import VideoCard from './video-card'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type Props = {
    folderId: string
    videosKey: string
    workspaceId: string
    limit?:number
}

// const video = [
//     {
//       User: {
//         firstname: "Alice",
//         lastname: "Smith",
//         image: "randomuser.me",
//       },
//       id: "vid_abc123",
//       processing: false,
//       Folder: {
//         id: "folder_mktg",
//         name: "Marketing Assets",
//       },
//       createdAt: new Date("2024-10-25T10:00:00Z"),
//       title: "Quarterly Review 2024",
//       source: "https://example.com/videos/q3-review.mp4",
//     },
//     {
//       User: {
//         firstname: "Bob",
//         lastname: "Johnson",
//         image: "randomuser.me",
//       },
//       id: "vid_def456",
//       processing: true,
//       Folder: {
//         id: "folder_eng",
//         name: "Engineering Builds",
//       },
//       createdAt: new Date("2024-10-24T14:30:00Z"),
//       title: "V4.1 Feature Walkthrough",
//       source: "https://example.com/videos/v4-walkthrough.mp4",
//     },
//     {
//       User: {
//         firstname: null, // Example of a null user field
//         lastname: "Doe",
//         image: null,     // Example of a null image field
//       },
//       id: "vid_ghi789",
//       processing: false,
//       Folder: null, // Example of a video not in a folder
//       createdAt: new Date("2024-10-23T09:45:00Z"),
//       title: null,  // Example of a null title
//       source: "https://example.com/videos/untitled-clip.mp4",
//     },
//   ];
  

const Videos = ({ folderId, videosKey, workspaceId, limit }: Props) => {

    // this part of code is to set visible items on load
    const [showAll, setShowAll] = useState(false)
    const countLimit = 5;

    // console.log(folderId,"-",videosKey,"-",workspaceId)
    
    const { 
        data: videoData,
        isFetching,
     } = useQueryData(
        [videosKey, folderId], 
        () => getAllUserVideos(folderId, limit)
    )

    if(isFetching){
        return(
            <div className='flex items-center justify-center p-8'>
                <Loader2 className='h-6 w-6 animate-spin text-neutral-400' />
                <span className='ml-2 text-neutral-400'>Loading Videos...</span>
            </div>
        )
    }
    const { status: videosStatus, data: videos = [] } = (videoData as VideosProps) || {}

    // visible items: display limit (0 for show all else limit)
    const displayVideos =
      showAll || !Array.isArray(videos)
        ? videos
        : videos.slice(0, countLimit);

  return (
    <div className='flex flex-col gap-4 mt-4'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
                <VideoIcon />
                <h2 className='text-[#BDBDBD] text-xl'>Videos</h2>
            </div>
        {Array.isArray(videos) && videos.length > countLimit && (
            <div className='flex items-center gap-2'>
                
                <p 
                    className='text-[#BDBDBD] cursor-pointer'
                    onClick={() => setShowAll((prev) => !prev)}
                >
                    {showAll ? "See Less" : "See All"}
                </p>
                {showAll ? <ArrowLeft color='#707070' /> : <ArrowRight color='#707070' />}
                
            </div>
        )}
        </div>
        <section className={cn(videosStatus !== 200 ? 'p-5' : 'grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5')}>
            {videosStatus === 200 && Array.isArray(displayVideos) ? (
              displayVideos.map((video: any) => (
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
        {Array.isArray(videos) && videos.length > countLimit && (
          <Button
            className="mt-2 text-neutral-500 cursor-pointer"
            onClick={() => setShowAll((prev) => !prev)}
            variant={'outline'}
          >
            {showAll ? (
                    <p className='flex items-center gap-2'>
                        <ArrowUp color='#707070' />
                        Show Less
                    </p>
                ): ( 
                    <p className='flex items-center gap-2'>
                        Show All
                        <ArrowDown color='#707070' />
                    </p>
                )
            }
          </Button>
        )}
    </div>
  )
}

export default Videos