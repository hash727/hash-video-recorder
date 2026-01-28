'use client'

import { getAllUserVideos } from '@/actions/workspace'
import { useQueryData } from '@/hooks/useQueryData'
import { VideosProps } from '@/types/type'
import { Loader2, VideoIcon } from 'lucide-react'
import React from 'react'
import VideoCard from './video-card'
import { cn } from '@/lib/utils'

type Props = {
    folderId: string
    videosKey: string
    workspaceId: string
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
  

const Videos = ({ folderId, videosKey, workspaceId }: Props) => {

    // console.log(folderId,"-",videosKey,"-",workspaceId)
    
    const { 
        data: videoData,
        isFetching,
     } = useQueryData(
        [videosKey, folderId], 
        () => getAllUserVideos(folderId)
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

export default Videos