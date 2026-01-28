export type WorkSpaceProps = {
    data: {
        subscription: {
            plan: 'FREE' | 'PRO'
        } | null
        WorkSpace: {
            id: string
            name: string
            type: 'PUBLIC' | 'PERSONAL'
        }[]
        members: {
            WorkSpace: {
                id: string
                name: string
                type: 'PUBLIC' | 'PERSONAL'
            }
        }[]
    }
}

export type NotificationProps = {
    status: number
    data: {
        _count: {
            notification: number
        }
    }
}
export type FolderProps = {
    status: number
    data: {
        name: string
        _count: {
            videos: number
        }
    }
}

export type VideosProps = {
    status: number
    data: {
        User: {
            firstname: string | null
            lastname: string | null
            image: string | null
            trial: boolean
            subscription: {
                plan: 'PRO' | 'FREE'
            }
        } | null
        id: string
        processing: boolean
        Folder: {
            id: string
            name: string
        } | null
        createdAt: Date
        title: string | null
        description: string | null
        source: string
        views: number
        summary: string
    }
    author: boolean
}

export type CommentRepliesProps = {
    id: string
    comment: string
    createdAt: Date
    commentId: string | null
    userId: string | null
    videoId: string | null
    User: {
        id: string
        email: string
        firstname: string | null
        lastname: string | null
        createdAt: Date
        clerkid: string
        image: string | null
        trial: boolean
        firstView: boolean
    } | null
}

export type VideoCommentProps = {
    data: {
        User: {
            id: string
            email: string
            firstname: string | null
            lastname: string | null
            createdAt: Date
            clerkid: string
            image: string | null
            trial: boolean
            firstView: boolean
        } | null
        reply: CommentRepliesProps[]
        id: string
        comment: string
        createdAt: Date
        commentId: string | null
        userId: string | null
        videoId: string | null
    }[]
}