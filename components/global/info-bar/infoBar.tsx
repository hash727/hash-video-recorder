import { searchUsers } from '@/actions/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User } from '@/lib/generated/prisma/client'
import { UserButton } from '@clerk/nextjs'
import { FileVideoCameraIcon, ImageIcon, Search, UploadCloudIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'

// type SearchRes =

const InfoBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    // const [debouncedSearchTerm] = useDebounce(searchTerm, 300); // Debounce for 300ms
    const [ results, setResults ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false)
    // const [showResults, setShowResults] = useState(false)

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if(searchTerm.length < 2){
                setResults([]);
                return;
            }

            setIsLoading(true);
            try{
                const response = await fetch(`/api/search?q=${searchTerm}`);
                const data = await response.json();
                setResults(data)
            } catch (error) {
                console.error("Search failed", error)
            } finally {
                setIsLoading(false)
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm]);

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

                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Hover / Dropdown list */}
            <div className='absolute top-full left-[265px] w-full max-w-lg mt-2 bg-[#111111] border rounded-lg shadow-xl z-50'>

             {/* 1. Loading state */}
             {isLoading && (
                        <div className='flex items-center justify-center p-4'>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-sm text-gray-500">Searching...</span>
                        </div>
                    )}

            {!isLoading && results.length > 0 && (
                results.map((user: any) => (
                        <div
                            key={user.id}
                            className='p-3 hover:bg-[#1D1D1D]/98 cursor-pointer border-b last:border-none rounded-lg'
                        >
                            <div className='flex justify-between'>
                                <div>
                                    
                                    <p className='font-semibold flex flex-1 gap-2 items-center align-middle'>
                                        
                                        {user.firstname} 
                                        {" "}
                                        {user.lastname}
                                    </p>
                                    <p className='text-sm text-neutral-400'>{user.email}</p>
                                </div>
                                <img
                                    src={user.image}
                                    alt={user.id}
                                    width={'48px'}
                                    height={'48px'}
                                    className='rounded-full '
                                />
                            </div>
                        </div>
                    ))
                )}

                {/* 3. Empty state */}
                {!isLoading && searchTerm.length >=2 && results.length === 0 && (
                    <div className="p-4 text-center text-sm text-gray-500">
                    No users found for <span className="font-bold">"{searchTerm}"</span>
                  </div>
                )}

                </div>
        </div>
        <div className='flex items-center gap-4'>
            <Button className='bg-[#9D9D9D] flex items-center gap-2'>
                <UploadCloudIcon
                    size={20}
                />{' '}
                <span className='flex items-center gap-2'>Upload</span>
            </Button>
            <Button className='bg-[#9D9D9D] flex items-center gap-2'>
                <FileVideoCameraIcon
                    size={20}
                />{' '}
                <span className='flex items-center gap-2'>Record</span>
            </Button>
            <UserButton />
        </div>
    </header>
  )
}

export default InfoBar