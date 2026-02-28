'use client'
import { getWorkSpaceInfo } from '@/actions/workspace'
import { useQueryData } from '@/hooks/useQueryData'
import { wsinfoProps } from '@/types/type'
import { Folders, WorkflowIcon } from 'lucide-react'
import React from 'react'

type Props = {
    workSpaceId: string
}

export type FoldersProps = {
    status: number
    data: ({
        _count: {
            videos: number
        }
    } & {
        id: string
        name: string
        createdAt: Date
        workSpaceId: string | null
    })[]
}

const FoldersInWS = ({workSpaceId}: Props) => {
    const { data, isFetching } = useQueryData(
        ['wsFolders-info', workSpaceId],
        () => getWorkSpaceInfo(workSpaceId)
    )

    if(isFetching){
        return <div className='text-[#BDBDBD]'>Loading WorkSpace info...</div>
    }

    const { data: wsFolder } = data as wsinfoProps
    console.log(wsFolder)

  return (
    <div className='flex items-center gap-5'>
        <WorkflowIcon size={36} />
        <h2 className='text-[#BDBDBD] text-2xl'>
            {wsFolder.name} 
        </h2>
        <p className='flex gap-2 items-center'>
            <Folders size={36} /> ( {wsFolder._count.folders} )
        </p>
    </div>
  )
}

export default FoldersInWS