import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type initialStateProps = {
    folders: ({
        _count: {
            videos: number
        }
    } & {
        id: string
        name: string
        createdAt: Date
        workSpaceId: string | null
    })[]
}


const initialState: initialStateProps = {
    folders: [],
}

export const Folders = createSlice({
    name: 'folders',
    initialState,
    reducers: {
        setFOLDERS: (state, action: PayloadAction<initialStateProps['folders']>) => {
            // return { ...action.payload }
            state.folders = action.payload
        },
    },
})

export const { setFOLDERS } = Folders.actions
export default Folders.reducer