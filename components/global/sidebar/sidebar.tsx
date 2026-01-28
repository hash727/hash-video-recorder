'use client'
import Image from 'next/image'
import React from 'react'
import { 
    Select, 
    SelectContent, 
    SelectGroup, 
    SelectItem, 
    SelectLabel, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { usePathname, useRouter } from 'next/navigation';
import { Separator } from '../../ui/separator';
import { useQueryData } from '@/hooks/useQueryData';
import { getWorkSpaces } from '@/actions/workspace';
import { NotificationProps, WorkSpaceProps } from '@/types/type';
import Modal from '../modal';
import { Menu, PlusCircle } from 'lucide-react';
import Search from '../search-user';
import { MENU_ITEMS } from '@/constants/constant';
import SidebarItem from './sidebar-items';
import { count } from 'console';
import { getNotifications } from '@/actions/user';
import WorkSpacePlaceholder from './workspace-placeholder';
import GlobalCard from '../globar-card/globalCard';
import { Button } from '@/components/ui/button';
import Loader from '../loader/loader';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import InfoBar from '../info-bar/infoBar';
import { useDispatch } from 'react-redux';
import { WORKSPACES } from '@/app/redux/slices/workSpaces';
import PaymentButton from '../payment-button/paymentButton';
type Props = {
    activeWorkSapceId: string
}

const Sidebar = ({ activeWorkSapceId }: Props) => {


    // console.log(activeWorkSapceId);

    const router = useRouter();
    const pathName = usePathname();
    const dispatch = useDispatch();

    const {data, isFetched} = useQueryData(['user-WorkSpaces'], getWorkSpaces)

    const menuItems = MENU_ITEMS(activeWorkSapceId);

    // console.log(data)

    const { data:notifications} = useQueryData(["user-notifications"], getNotifications)

    const {data: WorkSpace } = data as WorkSpaceProps
    const { data: count } = notifications as NotificationProps

    const onChangeActiveWorkspace = (value: string) => {
        router.push(`/dashboard/${value}`)
    }

    const currentWorkSpace = WorkSpace.WorkSpace.find(
        (s) => s.id === activeWorkSapceId
    )

    if(isFetched && WorkSpace){
        dispatch(WORKSPACES(WorkSpace.WorkSpace))
    }

  const SidebarSection = (
    <div className='bg-[#111111] flex-none relative p-4 h-full w-[250px] flex flex-col gap-4 items-center overflow-hidden'>
        <div className='bg-[#111111] flex p-4 gap-2 justify-center items-center mb-4 absolute top-0 left-0 right-0'>
            <Image 
                src={`/logo.svg`} 
                height={60} 
                width={60} 
                alt='Logo' 
            />
            <p className='text-2xl'>HasH</p>
        </div>
        <div className='mt-[60px] '>
            <Select 
                defaultValue={activeWorkSapceId ? activeWorkSapceId : undefined} 
                onValueChange={onChangeActiveWorkspace}
            >
                <SelectTrigger className='mt-16 text-neutral-400 bg-transparent'>
                    <SelectValue placeholder="Select a workspace"></SelectValue>
                </SelectTrigger>

                <SelectContent className='bg-[#111111] backdrop-blur-xl'>
                    <SelectGroup >
                        <SelectLabel>Workspaces</SelectLabel>
                        <Separator />
                        {WorkSpace.WorkSpace.map((workspace) => (
                            <SelectItem 
                                key={workspace.id}
                                value={workspace.id}
                            >
                                {workspace.name}
                            </SelectItem>
                        ))}
                        {WorkSpace.members.length > 0 && WorkSpace.members.map(
                            (workspace) => workspace.WorkSpace && 
                            <SelectItem
                                value={workspace.WorkSpace.id}
                                key={workspace.WorkSpace.id}
                            >
                                {workspace.WorkSpace.name}
                            </SelectItem>
                        )}
                    </SelectGroup>
                </SelectContent>
            </Select>
            { currentWorkSpace?.type ==="PUBLIC" && WorkSpace.subscription?.plan === "PRO" && (
            <Modal title='Invite to WorkSpace' trigger={
                <span className='text-sm cursor-pointer flex items-center justify-center bg-neutal-800/70 hover:bg-neutral-800/60 w-full rounded-sm p-[5px] gap-2'>
                    <PlusCircle size={15} className='text-neutral-800/90 fill-neutral-500' />
                    <span className='text-neutral-400 font-semibold text-xs'>Invite to WorkSpace</span>
                </span>
            }
                description='Invite other user to your WorkSpace'
            >
                <Search workSpaceId={activeWorkSapceId} />
            </Modal>
            )}
            <p className='w-full text-[#9D9D9D] font-bold mt-4'>Menu</p>
            <nav className='w-full'>
                <ul>{menuItems.map((item) =>(
                    <SidebarItem 
                        href={item.href}
                        icon={item.icon}
                        selected={pathName === item.href}
                        title={item.title}
                        key={item.title}
                        notifications={
                            (item.title === 'Notifications' && count._count && count._count.notification) || 0 
                        }
                    />
                ))}</ul>
            </nav>
            <Separator className='w-4/5' />
            <p className='w-full text-[#9D9D9D] font-bold mt-4'>WorkSpaces</p>
            {
                WorkSpace.WorkSpace.length === 1 && WorkSpace.members.length === 0 && 
                <div className='w-full mt-[-10px]' >
                        <p className='text-[#3c3c3c] font-medium text-sm'>
                            {WorkSpace.subscription?.plan === 'FREE' ? 'Upgrade to create WorkSpaces' : 'No WorkSpaces'}
                        </p>
                </div>
            }
            <nav className='w-full'>
                <ul className='h-[150px] overflow-auto overflow-x-hidden fade-layer'>
                    {WorkSpace.WorkSpace.length > 0 && WorkSpace.WorkSpace.map((item) => 
                        item.type !== 'PERSONAL' && (
                        <SidebarItem 
                            href={`/dashboard/${item.id}`}
                            selected={pathName === `/dashboard/${item.id}`}
                            title={item.name}
                            notifications={0}
                            key={item.name}
                            icon={<WorkSpacePlaceholder>
                                {item.name.charAt(0)}
                            </WorkSpacePlaceholder>}
                        />
                    ))}
                    {
                        WorkSpace.members.length > 0 && WorkSpace.members.map((item) => (
                            <SidebarItem 
                                href={`/dashboard/${item.WorkSpace.id}`}
                                selected={pathName === `/dashboard/${item.WorkSpace.id}`}
                                title={item.WorkSpace.name}
                                notifications={0}
                                key={item.WorkSpace.name}
                                icon={<WorkSpacePlaceholder>
                                    {item.WorkSpace.name.charAt(0)}
                                </WorkSpacePlaceholder>}
                            />
                        ))
                    }
                    
                </ul>
            </nav>
            <Separator className='w-4/5' />
            {WorkSpace.subscription?.plan === 'FREE' && <GlobalCard 
            title='Upgrade to Pro'
            description='Unlock AI features like transcription, AI Summary, and more.'
            footer={
                // <Button className='text-sm w-full mt-2'>
                //     <Loader color='#000' state={false}>Upgrade</Loader>
                // </Button>
                <PaymentButton />
            }
            />
                
                }
        </div>
    </div>
  )

  return <div className='full'>
    {/* Infor bar */}
    <InfoBar />
    {/* sheet mobile and desktop */}
    <div className='md:hidden fixed my-4'>
        <Sheet>
            <SheetTrigger
                asChild
                className='ml-2'
            >
                <Button variant='ghost' className='mt-[2px]'>
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side={`left`} className='p-0 w-fit h-full'>
                {SidebarSection}
            </SheetContent>
        </Sheet>
    </div>
    <div className='md:block hidden h-full'>{SidebarSection}</div>
  </div>
}

export default Sidebar