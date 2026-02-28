'use client'

import React from 'react'
import InfoBar from '../info-bar/infoBar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import Image from 'next/image'
import { useQueryData } from '@/hooks/useQueryData'
import { getAllFolders, getAllFoldersInWs, getWorkspaceFolders, getWorkSpaceInfo } from '@/actions/workspace'
import {UserWSFoldersProps, WSFoldersProps, wsinfoProps} from '@/types/type'
import SidebarItem from './sidebar-items'
import { useQuery } from '@tanstack/react-query'
import UserSidebarItem from './userSidebar-items'
import WorkSpacePlaceholder from './workspace-placeholder'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

type Props = {
    workspaceId: string,
    userid: string
}



const SidebarUser = ({userid, workspaceId}: Props) => {

    const pathName = usePathname();

    // const {data, isFetched} = useQueryData(['ws-folders'], getAllFolders)
    const { data, isFetched, isPending } = useQueryData(
        ['WorkSpace-folders'], 
        () => getWorkspaceFolders(workspaceId) 
    );

    // if(isFetched)
    const { data:wsinfo } = useQueryData(
        ['WS-Info', workspaceId],
        () => getWorkSpaceInfo(workspaceId)
    )
      
      // 1. Handle loading state
      if (isPending) return <p>Loading...</p>;
      
      // 2. Now it is safe to destructure
      const { data: WSFolders } = data as UserWSFoldersProps ;

      const { data: wsdetails } = wsinfo as wsinfoProps

    //   console.log(WSFolders, ": WS Name: ", (wsinfo as any)?.data?.name ?? "Unknown");
    console.log(wsdetails)


    const SideBarUser = (
        <div className='bg-[#111111] flex-none relative p-4 h-full w-[250px] flex flex-col gap-4 items-center overflow-y-scroll'>
            <a
                href={'/dashboard'}
            >
            <div className='bg-[#111111] flex p-4 gap-2 justify-center items-center mb-4 absolute top-0 left-0 right-0'>
                <Image 
                    src={`/logo.svg`} 
                    height={60} 
                    width={60} 
                    alt='Logo' 
                />
                <p className='text-2xl'>HasH</p>
            </div>
            </a>
            <div className='mt-[60px] text-neutral-500'>
                {/* Work Space : {(wsinfo as any)?.data?.name ?? workspaceId} */}
                Work Space selected : 
                <p className='ml-4 text-sm font-semibold text-neutral-700!'>
                    {wsdetails.name} ({wsdetails._count.folders})
                </p>
                <p className='w-full text-[#9D9D9D] font-bold mt-4'>Folders:</p>
                {WSFolders.length === 0 && (
                    <div className='w-full mt-[-10px]'>
                        <p className='text-[#3C3C3C] font-medium text-sm'>
                            No Folder's for the selected Work Space
                        </p>
                    </div>
                )}
                <nav className='w-full'>
                {WSFolders.length > 0 && WSFolders.map((folder) => (
                    <>
                        {/* <p key={folder.id}>{folder.name}</p> */}
                        <UserSidebarItem
                            icon={
                                <WorkSpacePlaceholder>
                                    {folder.name.charAt(0)}
                                </WorkSpacePlaceholder>
                            }
                            href={`/users/${userid}/${workspaceId}/folders/${folder.id}`}
                            selected={pathName === `/users/${userid}/${workspaceId}/folders/${folder.id}`}
                            title={folder.name}
                            notifications={0}
                            key={folder.name}
                            video_count={folder._count.videos}
                        />
                    </>
                ))}

                </nav>

            </div>
        </div>
    )

  return (
    <div className='full'>
        <InfoBar />
        {/* Sheet mobile and desktop */}
        <div className='md: hidden fixed my-4'>
            <Sheet>
                <SheetTrigger
                    asChild
                    className='ml-2'
                >
                    <Button variant={'ghost'} className='mt-[2px]'>
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent side={`left`} className='p-0 w-fit h-full'>
                    {SideBarUser}
                </SheetContent>
            </Sheet>

        </div>
        <div className='lg:md:block hidden h-full'>
            
            {SideBarUser}
        </div>

    </div>

  )
}

export default SidebarUser