'use server'

import client from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { sendEmail } from "./user"
import { createClient, OAuthStrategy} from '@wix/sdk'
import { items } from '@wix/data'
import axios from "axios"

export const verifyAccessToWorkspace = async (workspaceId: string) => {
    try{
        const user = await currentUser()
        // console.log(user);
        if(!user) return { status: 403 }

        const isUserInWorkspace = await client.workSpace.findUnique({
            where: {
                id: workspaceId,
                OR: [
                    {
                        User:{
                            clerkid:user.id,
                        },
                    },
                    {
                        members:{
                            every:{
                                User:{
                                    clerkid: user.id,
                                },
                            },
                        },
                    },
                ],
            },
        })
        if(isUserInWorkspace){
            return {
                status: 200,
                data: { WorkSpace: isUserInWorkspace},
            }
        }
        return {
            status: 404,
            data: { WorkSpace: null }
        }
    }catch(error){
        return {
            status: 403,
            data: { WorkSpace: null },
            error: {  error }
        }
    }
}


export const getWorkspaceFolders = async (workSpaceId: string) => {
    try{
        const isFolders = await client.folder.findMany({
            where: {
                workSpaceId,
            },
            include:{
                _count:{
                    select:{
                        videos: true,
                    },
                },
            },
        })
        if(isFolders && isFolders.length > 0){
            return { status: 200, data: isFolders }
        }
        return { status: 404, data: [] }
    }catch(error) {
        return { status: 403, data: [] }

    }
}


export const getAllUserVideos = async (workSpaceId: string) => {
    try{
        const user = await currentUser();
        if(!user) return { status: 404 }
        const videos = await client.video.findMany({
            where:{
                OR: [{workSpaceId}, { folderId: workSpaceId }],
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                source: true,
                processing: true,
                Folder: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                User: {
                    select: {
                        firstname: true,
                        lastname: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        })

        if(videos && videos.length > 0){
            return { status: 200, data: videos }
        }

        return { status: 404 }
    } catch(error){
        return { status: 400 }
    }
}

export const getWorkSpaces = async () => {
    try{
        const user = await currentUser();
        if(!user) return { status: 404 }

        const workSpaces = await client.user.findUnique({
            where: {
                clerkid: user.id,
            },
            select: {
                subscription: {
                    select: {
                        plan: true,
                    },
                },
                WorkSpace: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                    },
                },
                members: {
                    select: {
                        WorkSpace: {
                            select: {
                                id: true,
                                name: true,
                                type: true,
                            },
                        },
                    },
                },
            },
        })

        if(workSpaces){
            return { status: 200, data: workSpaces }
        }
    }catch(error){
        return { status: 400 }
    }
}

export const CreateWorkspace = async (name: string) => {
    try{
        const user = await currentUser()
        if(!user) return { status: 404 }

        const authorized = await client.user.findUnique({
            where: {
                clerkid: user.id,
            },
            select: {
                subscription: {
                    select: {
                        plan: true,
                    },
                },
            },
        })

        if(authorized?.subscription?.plan === "PRO"){
            const WorkSpace = await client.user.update({
                where: {
                    clerkid: user.id,
                },
                data:{
                    WorkSpace: {
                        create: {
                            name,
                            type: 'PUBLIC',
                        },
                    },
                },
            })

            if(WorkSpace){
                return { status: 201, data: 'WorkSpace Created' }
            }
        }

        return {
            status: 401, 
            data: 'You are not authorized to create a workspace.',
        }
    }catch(error){
        return {
            status: 400,
            error: error,
            data: 'Something went wrong.'
        }
    }
}

export const renameFolders = async (folderId: string, name: string) => {
    try {
        console.log(folderId,"-",name);
        const folder = await client.folder.update({
            where: {
                id: folderId,
            },
            data: {
                name,
            },
        })
        if(folder){
            return { status: 200, data: 'Folder Renamed'}
        }
        return { status: 400, data: 'Folder does not exist'}

    } catch (error) {
        return { status: 500, data: 'Oops! Some thing went Wrong'}
        
    }
}

export const createFolders = async (workspaceId: string) => {
    try {
        const isNewFolder = await client.workSpace.update({
            where: {
                id: workspaceId,
            },
            data: {
                folders: {
                    create: { name: 'Untitled' },
                },
            },
        })
        if(isNewFolder){
            return {status: 200, message: 'New Folder Created'}
        }
        return {status: 400, message: 'Could not create folder'}

    } catch (error) {
        return {status: 500, message: 'Oops!, Something went wrong'}
        
    }
}

export const getFolderInfo = async (folderId: string) => {
    try {
        const folder = await client.folder.findUnique({
            where: {
                id: folderId,
            },
            select: {
                name: true,
                _count: {
                    select: {
                        videos: true,
                    },
                },
            },
        })
        if(folder) 
            return {
                status: 200,
                data: folder,
            }

        return {
            status: 400,
            data: null,
        }
    } catch (error) {
        return {
            status: 500,
            data: error
        }
    }
}


export const moveVideoLocation = async (
    videoId: string,
    workSpaceId: string,
    folderId: string
) => {
    try {
        const location = await client.video.update({
            where: {
                id: videoId,
            },
            data: {
                folderId: folderId || null,
                workSpaceId,
            },
        })
        
        if(location) return {
            status: 200,
            data: 'Folder changed successfully'
        }
        return{
            status: 404,
            data: 'WorkSpace/Folder not found'
        }
    } catch (error) {
        return {
            status: 500,
            data: 'Oops! something went wrong'
        }
    }
}


export const getPreviewVideo = async (videoId: string) => {
    try {
        const user = await currentUser()
        if(!user) return { status: 404 }
        const video = await client.video.findUnique({
            where:{
                id: videoId,
            },
            select: {
                title: true,
                createdAt: true,
                source: true,
                description: true,
                processing:true,
                views: true,
                summery:true,
            
                User: {
                    select:{
                        firstname: true,
                        lastname: true,
                        image: true,
                        clerkid: true,
                        trial: true,
                        subscription: {
                            select: {
                                plan: true,
                            },
                        },
                    },
                },
            },
        })

        if(video){
            return {
                status: 200,
                data: video,
                author: user.id === video.User?.clerkid ? true : false,
                error: null
            }
        }

        return { status: 404, error: "some thing went wrong"}
    } catch (error) {
        return {
            status: 500,
            error: error,
        }
    }
}


export const sendEmailForFirstView = async (videoId: string) => {
    // console.log(videoId);
    try {
        const user = await currentUser()
        if(!user) return { status: 404 }

        const firstViewSettings = await client.user.findUnique({
            where: { clerkid: user.id },
            select: {
                firstView: true,
            },
        })
        // console.log(firstViewSettings?.firstView)
        if(!firstViewSettings?.firstView) return

        const video = await client.video.findUnique({
            where: {
                id: videoId,
            },
            select: {
                title: true,
                views: true,
                User: {
                    select: {
                        email: true,
                    },
                },
            },
        })
        if(video && video.views === 0 ){
            await client.video.update({
                where:{
                    id: videoId,
                },
                data: {
                    views: video.views + 1,
                },
            })
        }

        if(!video) return

        const { transporter, mailOptions } = await sendEmail(
            video.User?.email!,
            'You got a viewer',
            `Your video ${video?.title} just got its first viewer`
        )

        transporter.sendMail(
            mailOptions,
            async ( error, info) => {
                if(error){
                    console.log(error.message)
                } else {
                    const notification = await client.user.update({
                        where: { clerkid: user.id },
                        data:{
                            notification: {
                                create: {
                                    content: mailOptions.text,
                                },
                            },
                        },
                    })
                    if(notification){
                        // console.log(notification)
                        return { status: 200 }
                    }
                }
            }
        )

    } catch (error) {
        console.log(error)
    }
}


export const editVideoInfo = async (
    videoId: string,
    title: string,
    description: string
) => {
    try {
        const video = await client.video.update({
            where: { id: videoId },
            data: {
                title,
                description,
            },
        })

        if(video) return { status: 200, data: 'Video successfully updated' }
        return { status: 404, data: 'Video not found' }
    } catch (error) {
        console.error(error)
        return { status: 500, data: 'Some thing went wrong, editing video'}
    }
}

export const getWixContent = async () => {
    try {
        const myWixClient = createClient({
            modules: { items },
            auth: OAuthStrategy({
                clientId: process.env.WIX_OAUTH_KEY as string,
            }),
        })

        // Fix: items.query expects a string (the collection id), not an object.
        const videos = await myWixClient.items.query('HasH-videos').find();


        console.log('my items:')
        console.log('Total:', videos.items.length);
        console.log(videos)
        console.log(videos.items
            .map((item) => item?.title_fld)
            .join('\n')
        );

        const videoIds = videos.items.map(v => v?.title_fld)

        console.log(videoIds)

        const video = await client.video.findMany({
            where: {
                id: {
                    in: videoIds,
                },
            },
            select: {
                id: true,
                createdAt: true,
                title: true,
                source: true,
                processing: true,
                workSpaceId: true,
                User: {
                    select: {
                        firstname: true,
                        lastname: true,
                        image: true,
                    },
                },
                Folder: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        })

        if(video && video.length > 0){
            return { status: 200, data: video }
        }
        return { status: 404 }
    } catch (error) {
        console.log(error)
        return { status: 500 }
    }
}


export const howToPost = async () => {
    try {
        const response = await axios.get(process.env.CLOUD_WAYS_POST as string)
        if(response.data){
            return {
                title: response.data[0].title.rendered,
                content: response.data[0].content.rendered,
            }
        }
    } catch (error) {
        return { status: 400 }
    }
}