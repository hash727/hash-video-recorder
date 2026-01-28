'use client'
import { getFolderInfo } from '@/actions/workspace'
import { useQueryData } from '@/hooks/useQueryData'
import { FolderProps } from '@/types/type'
import React from 'react'


type Props = {
    folderId: string 
}

const FolderInfo = ({ folderId }: Props) => {
    // const { folderId } = await params
    const { data, isFetching } = useQueryData(['folder-info'], () => getFolderInfo(folderId))

    if(isFetching){
        return <div className="text-[#BDBDBD]">Loading folder info...</div>;
    }

    const { data: folder } = data as FolderProps
    console.log(folder)
  return (
    <div className='flex items-center'>
        <h2 className='text-[#BDBDBD] text-2xl'>
            {folder.name}
        </h2>
    </div>
  )
}

export default FolderInfo