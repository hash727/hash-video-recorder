import { useAppDispatch, useAppSelector } from "@/app/redux/store"
import { useEffect, useState } from "react"
import { useMutationData } from "./useMutationData"
import { getWorkspaceFolders, moveVideoLocation } from "@/actions/workspace"
import useZodForm from "./useZodForm"
import { moveVideoSchema } from "@/components/forms/change-video-location/schema"
import { setFOLDERS } from "@/app/redux/slices/folders"


type FolderItem = Parameters<typeof setFOLDERS>[0];

export const useMoveVideos = (videoId: string, currentWorkSpace:string) => {
    const dispatch = useAppDispatch(); // Get the dispatch function
    // get state from redux
    const { folders } = useAppSelector((state) => state.FolderReducer)
    const { workSpaces } = useAppSelector((state) => state.WorkSpaceReducer)
    // console.log('videoId: ',videoId,'- WorkSpace:',currentWorkSpace)
    console.log(folders)

    // fetching states
    const [isFetching, setIsFetching] = useState(false)
    // state folders
    const [isFolders, setIsFolders] = useState<

        |   ({
                _count: {
                    videos:number
                } 
            } & {
                id:string 
                name:string 
                createdAt:Date 
                workSpaceId:string | null
            })[]
        | undefined
    >(undefined)

    
    // use mutation data optimistic
    const { mutate, isPending } = useMutationData(
        ['change-video-location'], 
        (data: {folder_id: string; WorkSpaceId: string}) => moveVideoLocation(videoId, data.WorkSpaceId, data.folder_id)
        
    )

    // usezod forms
    const { errors, onFormSubmit, watch, register } = useZodForm(
        moveVideoSchema as any, 
        mutate,
        { folder_id: null, WorkSpaceId: currentWorkSpace }
     )
    // fetchfolders
     const fetchFolders = async (WorkSpace: string) => {
        setIsFetching(true)
        const foldersData = await getWorkspaceFolders(WorkSpace)
        setIsFetching(false)
        if(foldersData.data) dispatch(setFOLDERS(foldersData.data))
        setIsFolders(foldersData.data)
        // dispatch(FOLDERS(folders.data as FolderItem[]))
     }
    // 

    useEffect(() => {
        fetchFolders(currentWorkSpace)
    }, [])

    useEffect(() => {
        const workspace = watch(async (value) => {
            if(value.WorkSpaceId) fetchFolders(value.WorkSpaceId)
        })
        
        return () => workspace.unsubscribe()
    },[watch])

    return {
        onFormSubmit,
        errors,
        register,
        isPending,
        folders,
        workSpaces,
        isFetching,
        isFolders,
    }
}
