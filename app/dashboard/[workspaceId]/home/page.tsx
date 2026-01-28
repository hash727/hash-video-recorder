import { getWixContent, howToPost } from '@/actions/workspace'
import HowToPost from '@/components/global/how-to-post/howToPost'
import VideoCard from '@/components/global/videos/video-card'
import React from 'react'

type Props = {}

const Home = async (props: Props) => {
    const videos = await getWixContent()
    const post = await howToPost()

    console.log(videos)
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
        <h1 className='text-2xl fond-bold'>A Message From The HasH Team</h1>

        {videos.status === 200 ? videos.data?.map((video) => <VideoCard 
            key={video.id}
            {...video}
            workspaceId={video.workSpaceId!}
        />) : ''}

        <HowToPost
            title={post?.title}
            html={post?.content}
        />
    </div>
  )
}

export default Home