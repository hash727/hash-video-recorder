import { getNotifications, onAuthenticateUser } from '@/actions/user'
import { getAllFolders, getAllFoldersInWs, getAllUserVideos, getWorkspaceFolders, getWorkSpaceInfo, getWorkSpaces } from '@/actions/workspace'
import { redirect } from 'next/navigation'
import React from 'react'
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query'
import Sidebar from '@/components/global/sidebar/sidebar'
import GlobalHeader from '@/components/global/global-header'
import SidebarUser from '@/components/global/sidebar/sidebarUser'

type Props = {
    params: Promise<{
        userid: string,
        workspaceId: string
    }>
    children: React.ReactNode
}

const Layout = async ({params, children}: Props) => {

    const { userid, workspaceId } = await params;
    const auth = await onAuthenticateUser();

    if(!auth.user?.WorkSpace) redirect('/auth/sign-in')
    if(!auth.user.WorkSpace.length) redirect('/auth/sign-in')

    console.log(userid," << - >> ",workspaceId)

    // const workspaces = await getWorkSpaces();
    const query = new QueryClient();

    await Promise.all([
        query.prefetchQuery({
            queryKey: ['ws-folders'],
            queryFn: () => getAllFolders()
        }),

        query.prefetchQuery({
            queryKey: ['WS-Info', workspaceId],
            queryFn: () => getWorkSpaceInfo(workspaceId),
        }),

        query.prefetchQuery({
            queryKey:  ['WorkSpace-folders', workspaceId],
            queryFn: () => getWorkspaceFolders(workspaceId),
        }),
    
           
        query.prefetchQuery({
            queryKey:  ['user-WorkSpaces'],
            queryFn: () => getWorkSpaces(),
        }),
    
        query.prefetchQuery({
            queryKey:  ['user-videos', workspaceId],
            queryFn: () => getAllUserVideos(workspaceId),
        }),
        
        query.prefetchQuery({
            queryKey:  ['user-notifications'],
            queryFn: () => getNotifications(),
        }),
    ]) 
  return (
    <HydrationBoundary state={dehydrate(query)}>
        <div className='flex h-screen w-screen'>
            <SidebarUser userid={userid} workspaceId={workspaceId} />
            <div className='w-full pt-28 p-6 overflow-y-scroll overflow-x-hidden'>
                {/* <GlobalHeader workspace={workspaces?.data?.WorkSpace} /> */}
                <div className='mt-4'>{children}</div>
            </div>
        </div>
    </HydrationBoundary>
  )
}

export default Layout