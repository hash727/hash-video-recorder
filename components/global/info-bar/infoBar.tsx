'use client'
import { getUserProfile, onAuthenticateUser, searchUsers } from '@/actions/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User } from '@/lib/generated/prisma/client'
import { useUser, useAuth, UserButton } from '@clerk/nextjs'
import { FileVideoCameraIcon, Folders, ImageIcon, ListVideo, Search, UploadCloudIcon, UsersRound, VideoIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
// import { currentUser } from "@clerk/nextjs/server"
// import VideoUploadModal from '../uploads/videoUploadModal'
import dynamic from 'next/dynamic'
import { getWorkSpaces, getWorkSpaceUser } from '@/actions/workspace'
import { useQueryData } from '@/hooks/useQueryData'
import RecorderModal from '../videos/recorder/recorderModal'

// dynamically import the modal with SSR disabled
const VideoUploadModal = dynamic(() => import('../uploads/videoUploadModal'), {
    ssr: false,
});

// type SearchRes =

const InfoBar = () => {
    const [isMounted, setIsMounted] = useState(false);
    const {user, isLoaded } = useUser()
    const [dbUser, setDbUser] = useState<any>(null)

    const [searchTerm, setSearchTerm] = useState('');
    // const [debouncedSearchTerm] = useDebounce(searchTerm, 300); // Debounce for 300ms
    const [ results, setResults ] = useState({users: [], workspaces: []});
    const [isOpen, setIsOpen] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false)
    // const [showResults, setShowResults] = useState(false)

    const [isModalOpen, setModalOpen] = useState(false);

    // const { userId } = useAuth()
    // console.log("User Id (infoBar) :", userId)

    // Effect for Hydration fix
    useEffect(() => {
        setIsMounted(true)
    }, [])

    // For DB User Profile
    useEffect(() => {
        const fetchUserId = async () => {
            if(user?.id) {
                console.log("🔍 Fetching Prisma profile for Clerk ID:", user.id);
                // Calls server-side function
                const response = await getUserProfile()
                if(response?.status === 200){
                    setDbUser(response.data)
                    console.log("✅ Prisma User Loaded:", response.data?.id);
                } else {
                    console.error("❌ Failed to fetch Prisma profile", response);
                }
            }
        }
        fetchUserId()
    }, [user?.id])

    // const workSpaces =  getWorkSpaceUser(userId || '')
    const {
        data: wsUserData,
        isFetching,
    } = useQueryData(
        ['user-WorkSpaces'],
        () => getWorkSpaces(),
    )

    // if(isFetching) {
    //     return <div>Loading...</div>;
    // }

    console.log("Prisma UserId: ", dbUser?.id)
    console.log('WS User Data: ', (wsUserData as any)?.data?.WorkSpace?.[0]?.id);
    
    
    // Search Debounce Effect

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if(searchTerm.length < 2){
                // setResults({[],[]});
                setIsOpen(false);
            }else{

                setIsLoading(true);
                try{
                    const response = await fetch(`/api/search?q=${searchTerm}`);
                    const data = await response.json();
                    console.log("FrontEnd: ", data)
                    if(data.status === 200){
                        setResults(data)
                    }else{
                        setResults({users: [], workspaces: []})
                    }
                    setIsOpen(true)
                } catch (error) {
                    console.error("Search failed", error)
                } finally {
                    setIsLoading(false)
                }
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm]);

    if(!isMounted) return <div className="pl-[80px] md:pl-[265px] h-[72px]" />

    // Fixes "Fewer Hooks" Error
    if (isFetching || !isLoaded) {
        // return <div className="pl-[80px] md:pl-[265px] p-4">Loading...</div>;
    }

    // Safe DATA Access
    const workSpaceIduser = (wsUserData as any)?.data?.WorkSpace?.[0]?.id;



  return (
    <header className='pl-[80px] md:pl-[265px] fixed p-4 w-full flex items-center justify-between gap-4 z-50'>
        <div className='flex gap-4 justify-center items-center border-2 rounded-full px-4 w-full max-w-lg bg-[#111111] '>
            <Search
                size={25}
                className='text-[#707070]'
            />
            <Input 
                // className='bg-transparent border-none placeholder:placeholder-neutral-500! placeholder:bg-clip-text ' 
                className='bg-transparent! border-none shadow-none focus-visible:ring-0 placeholder:placeholder-neutral-500!'
                placeholder='Search for people, projects, tags & folders'
                autoComplete="off"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm.length > 1 && setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            />

            {isOpen && (
                <div >
                {/* Hover / Dropdown list */}
                <div className='absolute top-full left-[265px] w-full max-w-lg mt-2 bg-[#1D1D1D] border rounded-lg shadow-xl z-50'>

                    {/* 1. Loading state */}
                    {isLoading && (
                        <div className='flex items-center gap-2 justify-center p-4'>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-sm text-gray-500">Searching...</span>
                        </div>
                    )}

                    {/* Results state */}

                    {/* User Results */}
                    {!isLoading && (
                        <div className="max-h-[450px] overflow-y-auto">
                            { results.users?.length > 0 && (
                            <div className='p-2'>
                                <p className="text-xs font-bold text-gray-400 uppercase">Users:</p>
                                {results.users.map((user: any) => (
                                        <div
                                            key={user.id}
                                            className='p-3 hover:bg-[#1D1D1D]/98 cursor-pointer border-b last:border-none rounded-lg'
                                        >

                                            <div className='flex justify-between'>
                                                <div>
                                                    
                                                    <p className='font-semibold flex flex-1 gap-2 items-center align-middle text-xl'>
                                                        
                                                        {user.firstname} 
                                                        {" "}
                                                        {user.lastname}
                                                    </p>
                                                    <p className='text-sm text-neutral-400'>{user.email}</p>
                                                    <hr className='mt-2' />
                                                    <div className='flex gap-2 text-sm text-neutral-700'>
                                                        <p className='font-semibold'>Members ({user._count.members}) </p>
                                                        <p className='text-sm'>Folders({user._count.WorkSpace})</p>
                                                        <p className='text-sm'>Videos ({user._count.videos})</p>
                                                        <p className='text-sm'>Notifications ({user._count.notification})</p>

                                                    </div>
                                                </div>
                                                <div>
                                                    <img
                                                        src={user.image}
                                                        alt={user.id}
                                                        width={'48px'}
                                                        height={'48px'}
                                                        className='rounded-full '
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Workspace Results */}
                            {(results.workspaces || []).length > 0 ? (
                                <div className='p-2 border-t first:border-none rounded-lg hover:bg-[#1D1D1D]/98'>
                                    <p className="text-xs font-bold text-gray-600 uppercase">WorkSpaces: </p>
                                    {results.workspaces.map((ws: any) => (
                                        <div
                                            key={ws.id}
                                            className='p-2 hover:bg-neutral-800/80 cursor-pointer rounded'
                                        >
                                            <div
                                                className='flex flex-col gap-2'
                                            >
                                                <p className='font-semibold text-xl text-neutral-500'>{ws.name}</p>

                                                <hr className='mt-2 bg-black' />
                                                <div className='flex gap-2 text-sm text-neutral-700 justify-between'>
                                                    <div className='flex gap-2'>
                                                        <p className='flex gap-1 font-semibold'>
                                                            <UsersRound size={16} /> 
                                                            Members ({ws._count.members}) 
                                                        </p>
                                                        <p className='flex gap-1 text-sm'>
                                                            <Folders size={16} />
                                                             Folders <a href={`/users/${ws.User.id}/${ws.id}/folders`} >({ws._count.folders})</a>
                                                        </p>
                                                        <p className='flex gap-1 text-sm'>
                                                            <ListVideo size={16} />
                                                            Videos <a href={`/users/${ws.User.id}/${ws.id}/folders`} > ({ws._count.videos})</a></p>
                                                    </div>
                                                    <div className='text-sm flex align-middle items-center gap-2'>
                                                        <img
                                                            src={ws.User.image}
                                                            alt={ws.User.firstname}
                                                            width={24}
                                                            height={24}
                                                            className='rounded-full'
                                                        />
                                                        <span className='flex font-semibold gap-2'>
                                                            <p>
                                                                {ws.User.firstname}
                                                                {" "}
                                                                {ws.User.lastname}
                                                            </p>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                searchTerm.length >= 2 && <p className='p-3 textxs text-gray-600'>No Work Space Exist</p>
                            )}

                        {/* 3. Empty state */}
                        {!isLoading && searchTerm.length >=2 && results.users?.length === 0 && results.workspaces?.length === 0 && (
                            <div className="p-4 text-center text-sm text-gray-500">
                            No users found for <span className="font-bold">"{searchTerm}"</span>
                            </div>
                        )}
                    </div>
                    )}
                </div>
            </div>
            )}
        </div>
        <div className='flex items-center gap-4'>
            <Button 
                onClick={() => setModalOpen(true)}
                className='bg-[#9D9D9D] flex items-center gap-2'
                disabled={isFetching || !dbUser?.id}
            >
                <UploadCloudIcon
                    size={20}
                />{' '}
                <span className='flex items-center gap-2'>Upload</span>
            </Button>
            {/* <Button className='bg-[#9D9D9D] flex items-center gap-2'>
                <FileVideoCameraIcon
                    size={20}
                />{' '}
                <span className='flex items-center gap-2'>Record</span>
            </Button> */}
            <RecorderModal 
                userId={dbUser?.id} 
                profilePic={dbUser?.image}
            />
            <UserButton />
        </div>
        
        <VideoUploadModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            userId={dbUser?.id}
            workspaceId={workSpaceIduser}
        />
        
    </header>
  )
}

export default InfoBar