import { getNotifications, onAuthenticateUser } from '@/actions/user'
import { getAllUserVideos, getWorkspaceFolders, getWorkSpaces, verifyAccessToWorkspace } from '@/actions/workspace'
import { redirect } from 'next/navigation'
import React from 'react'
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query'
import Sidebar from '@/components/global/sidebar/sidebar'
import GlobalHeader from '@/components/global/global-header'

type Props = {
    params: Promise<{workspaceId: string}> 
    children: React.ReactNode
}

const Layout = async ({ params, children}: Props) => {

    const { workspaceId } = await params;
    const auth = await onAuthenticateUser();

    if(!auth.user?.WorkSpace) redirect('/auth/sign-in')
    if(!auth.user.WorkSpace.length) redirect('/auth/sign-in')

    console.log(workspaceId);

    const hasAccess = await verifyAccessToWorkspace(workspaceId)

    console.log(hasAccess)

    if(hasAccess.status !== 200){
        redirect(`/dashboard/${auth.user?.WorkSpace[0].id}`)
    }

    if(!hasAccess.data?.WorkSpace) return null

    const query = new QueryClient();

    await Promise.all([
        query.prefetchQuery({
            queryKey:  ['WorkSpace-folders', workspaceId],
            queryFn: () => getWorkspaceFolders(workspaceId),
        }),
    
        query.prefetchQuery({
            queryKey:  ['user-videos', workspaceId],
            queryFn: () => getAllUserVideos(workspaceId),
        }),
    
        query.prefetchQuery({
            queryKey:  ['user-WorkSpaces'],
            queryFn: () => getWorkSpaces(),
        }),
    
        query.prefetchQuery({
            queryKey:  ['user-notifications'],
            queryFn: () => getNotifications(),
        }),
    ]) 
    


    
  return ( 
    <HydrationBoundary state={dehydrate(query)}>
        <div className='flex h-screen w-screen'>
            <Sidebar activeWorkSapceId={workspaceId} />
            <div className='w-full pt-28 p-6 overflow-y-scroll overflow-x-hidden'>
                <GlobalHeader workspace={hasAccess.data.WorkSpace}/>
                <div className='mt-4'>{children}</div>
            </div>
        </div>
    
    </HydrationBoundary>
  )
}

export default Layout