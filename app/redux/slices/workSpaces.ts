import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type initialStateProps = {
    workSpaces: {
        type: 'PUBLIC' | 'PERSONAL'
        name: string
        id: string
    }[]
}

const initialState: initialStateProps = {
    workSpaces: [],
}

export const WorkSpaces = createSlice({
    name: 'workSpaces',
    initialState: initialState,
    reducers: {
        WORKSPACES: (state, action: PayloadAction<initialStateProps['workSpaces']>) => {
            // return { ...action.payload }
            state.workSpaces = action.payload
        },
    },
})


export const { WORKSPACES } = WorkSpaces.actions
export default WorkSpaces.reducer