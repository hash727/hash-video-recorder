import { getAllUserVideos, getFolderInfo } from '@/actions/workspace'
import FolderInfo from '@/components/global/folders/folder-info'
import Videos from '@/components/global/videos/videos'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import React from 'react'

type Props = {
    params: Promise<{ 
        folderId: string,
        workspaceId: string
    }>
}

const FolderVideos = async ({params}: Props) => {
    const { folderId, workspaceId } = await params;

    console.log('Folder Id: ', folderId)

    const query = new QueryClient()
    await query.prefetchQuery({
        queryKey: ['folders-videos'],
        queryFn: () => getAllUserVideos(folderId),
    })

    await query.prefetchQuery({
        queryKey: ['folder-info'],
        queryFn: () => getFolderInfo(folderId)
    })

  return (
    <HydrationBoundary state={dehydrate(query)}>
        <div>Folder Videos :</div>
        <FolderInfo folderId={folderId} />
        <Videos
            workspaceId={workspaceId}
            folderId={folderId}
            videosKey='folders-videos'
        />
    </HydrationBoundary>
  )
}

export default FolderVideos