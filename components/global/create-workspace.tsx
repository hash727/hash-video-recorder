'use client'

import { getWorkSpaces } from '@/actions/workspace'
import { useQueryData } from '@/hooks/useQueryData'
import React from 'react'
import Modal from './modal'
import { Button } from '../ui/button'
import { FolderPlus, FolderPlusIcon } from 'lucide-react'
import WorkSpaceForm from '../forms/workspace-form'

const CreateWorkspace = () => {
    const {data} = useQueryData(['user-WorkSpaces'], getWorkSpaces)

    const {data: plan} = data as {
        status: number
        data: {
            subscription: {
                plan: 'PRO' | 'FREE'
            } | null
        }
    }

    if(plan.subscription?.plan === 'FREE'){
        return <></>
    }

    if(plan.subscription?.plan === 'PRO')
        return (
            <Modal
                title='Create a WorkSpace'
                description='Workspaces helps you collaborate with team members. You are assigned a default personal workspace where you can share videos in private with yourself.'
                trigger={<Button className='bg-[#1D1D1D] text-[#707070] flex items-center gap-2 py-6 px-4 rounded-2xl'>
                    <FolderPlus />
                    Create a workspace
                </Button>}
            >
                <WorkSpaceForm />
            </Modal>
        )
}

export default CreateWorkspace