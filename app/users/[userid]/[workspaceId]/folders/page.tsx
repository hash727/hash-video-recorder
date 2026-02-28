import { getAllFoldersInWs, getWorkSpaceInfo } from '@/actions/workspace'
import FolderInfo from '@/components/global/folders/folder-info'
import Folders from '@/components/global/folders/folders'
import FoldersInWS from '@/components/global/folders/foldersInWs'
import Videos from '@/components/global/videos/videos'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import React from 'react'

type Props = {
    params: Promise<{ 
      userid: string,
      workspaceId: string 
    }>
}

const FolderView = async ({params}: Props) => {
   
    const {userid, workspaceId} = await params;
    console.log(workspaceId)

    const query = new QueryClient()
    await query.prefetchQuery({
        queryKey: ['ws-folders'],
        queryFn: () => getAllFoldersInWs(workspaceId)
    })
    await query.prefetchQuery({
      queryKey: ['wsFolders-info'],
      queryFn: () => getWorkSpaceInfo(workspaceId)
    })

  return (
   <HydrationBoundary state={dehydrate(query)}>
      <FoldersInWS workSpaceId={workspaceId} />
      <Videos
            workspaceId={workspaceId}
            folderId={workspaceId}
            videosKey='folders-videos'
        />
   </HydrationBoundary>

  )
}

export default FolderView