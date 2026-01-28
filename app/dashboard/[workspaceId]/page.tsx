import { getWorkspaceFolders } from '@/actions/workspace'
import CreateFolders from '@/components/global/create-folders/create-folders'
import CreateWorkspace from '@/components/global/create-workspace'
import Folders from '@/components/global/folders/folders'
import Videos from '@/components/global/videos/videos'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'

type Props = {
  params: Promise<{ workspaceId: string }>
}


const WorkSpacePage = async ({ params }: Props) => {
  const {workspaceId} = await params
  const folderId = await getWorkspaceFolders(workspaceId)

  // console.log(workspaceId," / ",folderId)
  return (
    <div>
      <Tabs defaultValue='videos' className='mt-6'>
        <div className='flex w-full justify-between items-center'>
          <TabsList className='bg-transparent gap-2 pl-0' >
            <TabsTrigger
              className='p-[13px] px-6 rounded-full data-[state==active]:bg-[#252525]'
              value='videos'
            >
              Videos
            </TabsTrigger>
            <TabsTrigger
              className='p-[13px] px-6 rounded-full data-[state==active]:bg-[#252525]' 
              value='Archive'
            >
              Archive
            </TabsTrigger>
          </TabsList>
          <div className='flex gap-x-3'>
            <CreateWorkspace />
            <CreateFolders workspaceId={workspaceId} />
          </div>
        </div>
        <section className='py-9'>
          <TabsContent value='videos'>
            <Folders  workspaceId={workspaceId} />
            {workspaceId && folderId.data.length > 0 ? (
              <Videos 
                workspaceId={workspaceId} 
                folderId={folderId.data[0].id!} 
                videosKey='folders-videos'
              />
            ) : 'No Videos'}
          </TabsContent>
        </section>
      </Tabs>
    </div>
  )
}

export default WorkSpacePage