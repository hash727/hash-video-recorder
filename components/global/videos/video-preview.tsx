'use client'

import { editVideoInfo, getPreviewVideo, sendEmailForFirstView } from '@/actions/workspace'
import { useQueryData } from '@/hooks/useQueryData'
import { VideosProps } from '@/types/type'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import CopyLink from './copy-link'
import RichLink from './rich-link'
import { truncateString } from '@/lib/utils'
import { Download } from 'lucide-react'
import TabMenu from '../../tabs/tabs'
import AiTools from '../ai-tools/ai-tools'
import VideoTranscript from '../video-transcript/video-transcript'
import { TabsContent } from '@/components/ui/tabs'
import Activities from '../activities/activity'
import EditVideo from './edit'
import { useMutationData, useMutationDataState } from '@/hooks/useMutationData'
import { Input } from '@/components/ui/input'





type Props = {
    videoId: string
}

const VideoPreview = ({ videoId }: Props) => {

    // for renaming video inline
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [onRename, setOnRename] = useState(false)
    const Rename = () => setOnRename(true)
    const Renamed = () => setOnRename(false)

    // WIP: setup notify first view
    
    
    const router = useRouter()
    
    const {data} = useQueryData(
        ['preview-video'], 
        () => getPreviewVideo(videoId)
    )
    
    const notifyFirstView = async () => await sendEmailForFirstView(videoId)
    
    // Renaming title and description
    const { mutate, isPending } = useMutationData(
        ['edit-video-title'], 
        (data: {title:string; description: string}) => editVideoInfo(videoId, data.title, data.description), 
        "preview-video",
        Renamed
    )

    const { latestVariables } = useMutationDataState(['edit-video-title'])
    console.log(latestVariables)

    const handleTitleDoubleClick = (e: React.MouseEvent<HTMLHeadingElement>) => {
        e.stopPropagation()
        // Rename functionality
        Rename()
    }

    const updateVideoElement = (e: React.FocusEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        if(inputValue){
            mutate({title:inputValue, videoId})
        }
        else Renamed()
    }
    
    const { data: video, status, author } = data as VideosProps

    useEffect(() => {

        if(status !== 200) router.push('/')
    }, [status, router])
        
        const daysAgo = Math.floor(
            (new Date().getTime() - video.createdAt.getTime()) / (24 * 60 * 60 * 1000)
        )
        
        useEffect(() => {
            if(video.views === 0) {
                notifyFirstView()
            }
            return () => {
                notifyFirstView()
            }
        }, [])
        
    console.log(`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${video.source}`)
  return (
    <div className='grid grid-cols-1 xl:grid-cols-3 p-10 lg:px-20 lg:py-10 overflow-y-auto gap-5'>
        <div className='flex flex-col lg:col-span-2 gap-y-10'>
            <div>
                <div className='flex gap-x-5 items-start justify-between'>
                    {/* <h2 className='text-white text-4xl font-bold'>{video.title}</h2> */}
                    {/* inline rename code */}
                    {onRename ? (
                        <Input
                            onBlur={updateVideoElement}
                            autoFocus
                            placeholder={video.title!}
                            className='border-none underline text-base w-full outline-none text-neutral-300 bg-transparent p-0'
                            ref={inputRef}
                        />
                     ) : (
                        <h2
                            className='text-white text-4xl font-bold'
                            onClick={(e) => e.stopPropagation()}
                            onDoubleClick={handleTitleDoubleClick}
                        >
                            {latestVariables && latestVariables.status === 'pending' && latestVariables.variables.videoId ? latestVariables.variables.title : video.title}
                        </h2>
                      )}

                      {/* end of inline rename code */}
                    {author ? (
                        <EditVideo
                            videoId={videoId}
                            title={video.title as string}
                            description={video.description as string}
                        />
                    ) : (
                        <></>
                    )}
                </div>
                <span className='flex gap-x-3 mt-2'>
                    <p className='text-[#9D9D9D] capitalize'>
                        {video.User?.firstname} {video.User?.lastname}
                    </p>
                    <p className='text-[#707070]'>
                        {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
                    </p>
                </span>
            </div>
            <video
                preload='metadata'
                className='w-full aspect-video opacity-50 rounded-xl'
                controls
            >
                <source
                    src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${video.source}#1`}
                />
            </video>
            <div className='flex flex-col text-2xl gap-y-4'>
                <div className='flex gap-x-5 items-center justify-between'>
                    <p className='text-[#BDBDBD] text-semibold'>Description</p>
                    {author ? (
                        <EditVideo
                            videoId={videoId}
                            title={video.title as string}
                            description={video.description as string}
                        />
                     ) : (
                        <></>
                    )}
                </div>
                <p className='text-[#9D9D9D] text-lg text-medium'>
                    {video.description}
                </p>
            </div>
        </div>
        <div className='lg:col-span-1 flex flex-col gap-y-16'>
            <div className='flex justify-end gap-x-3 items-center'>
                <CopyLink
                    variant={'outline'}
                    className='rounded-full bg-transparent px-10'
                    videoId={videoId}
                />
                <RichLink
                    description={truncateString(video.description as string, 150)}
                    id={videoId}
                    source={video.source}
                    title={video.title as string}
                />
                <Download className='text-[#4c4c4c]' />
            </div>
            <div>
                <TabMenu 
                    defaultValue='Ai tools'
                    triggers={['Ai tools', 'Transcript', 'activity']}
                >
                    <AiTools 
                        plan={video.User?.subscription.plan!}
                        trial={video.User?.trial!}
                        videoId={videoId}                       
                    />
                    <VideoTranscript transcript={video.summary!} />
                    <Activities 
                        author={video.User?.firstname as string}
                        videoId={videoId}
                    />
                    
                </TabMenu>
            
            </div>
        </div>
    </div>
  )
}

export default VideoPreview