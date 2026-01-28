'use client'

import { cn } from '@/lib/utils'
import { ArrowRight, FolderIcon } from 'lucide-react'
import React from 'react'
import Folder from './folder'
import { useQueryData } from '@/hooks/useQueryData'
import { getWorkspaceFolders } from '@/actions/workspace'
import { useMutationDataState } from '@/hooks/useMutationData'
import { useDispatch } from 'react-redux'
import { setFOLDERS } from '@/app/redux/slices/folders'

type Props = {
    workspaceId: string
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

const Folders = ({workspaceId}: Props) => {
    console.log(workspaceId);
    const dispatch = useDispatch();

    // get folders
    const { data, isFetched, isPending } = useQueryData(
        ['WorkSpace-folders', workspaceId],
        () => getWorkspaceFolders(workspaceId)
    )

    // console.log(data,"-current folders ❓")

    // optimistic variable
    const { latestVariables } = useMutationDataState(['create-folder'])

    if(isPending){
        return <div>Loading folders...</div>
    }

    const { status, data: folders  } = data as FoldersProps;

    console.log(folders)

    // redux
    if(isFetched && folders){
        dispatch(setFOLDERS(folders));
    }


  return (
    <div className='flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-5'>
                <FolderIcon />
                <h2 className='text-[#BDBDBD] text-xl'>Folders</h2>
            </div>
            <div className='flex items-center gap-2'>
                <p className='text-[#BDBDBD] '>See all</p>
                <ArrowRight color='#707070' />
            </div>
        </div>
        <section 
            className={cn(status!==200 && 'justify-center','flex items-center gap-4 overflow-x-auto w-full')}
        >
            {/* <Folder name='Folder Title' /> */}
            {status!==200 ? (
                <p className='text-neutral-300'>No folders in workspace</p>
                ) : (
                    <>  
                        {latestVariables && latestVariables.status === 'pending' && (
                            <Folder 
                                name={latestVariables.variables.name} 
                                id={latestVariables.variables.id}
                                optimistic
                            />
                        )}
                        {folders.map((folder) =>(
                            <Folder
                                name={folder.name}
                                count={folder._count.videos}
                                id={folder.id}
                                key={folder.id}
                            />
                        ))}
                    </>
                    )}
            
        </section>
    </div>
  )
}

export default Folders