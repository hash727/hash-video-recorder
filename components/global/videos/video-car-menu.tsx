import { Move } from 'lucide-react'
import React from 'react'
import Modal from '../modal'
import ChangeVideoLocation from '@/components/forms/change-video-location/changeVideoLocation'

type Props = {
    videoId: string
    currentWorkSpace?: string
    currentFolder?: string
    currentFolderName?: string
}

const CardMenu = ({
    videoId,
    currentFolder,
    currentFolderName,
    currentWorkSpace
}: Props) => {

    // console.log(videoId,'-',currentFolder)
  return (
    
    <Modal 
        className='flex items-center cursor-pointer gap-x-2'
        description='This action cannot be undone. This will permanently delete your account and remove your data from our servers.'
        title="Move to new WorkSpace/Folder"
        trigger={
            <Move
                size={20}
                fill='#4F4F4F'
                className='text-[#4F4F4F]'
            />
        }
    >
        <ChangeVideoLocation 
            currentFolder={currentFolder}
            currentWorkSpace={currentWorkSpace}
            videoId={videoId}
            currentFolderName={currentFolderName}
        />
    </Modal>
  )
}

export default CardMenu