import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    logiCloseStep: 0,
    customize: null,
    isDrawerExpand: true,
    queryPassMatched: false
}

export const logiCloseSlice = createSlice({
    name: 'logiclose',
    initialState,
    reducers: {
        increment: (state) => {
            state.logiCloseStep += 1
        },
        decrement: (state) => {
            state.logiCloseStep -= 1
        },
        setlogiCloseStep: (state, { payload }) => {
            state.logiCloseStep = payload
        },
        OpenMenu: (state, { payload }) => {
            state.customize = payload
        },
        closeMenu: (state) => {
            state.customize = null
        },
        toggleDrawer: (state) => {
            state.isDrawerExpand = !state.isDrawerExpand
        },
        setQueryPassMatched: (state) => {
            state.queryPassMatched = !state.queryPassMatched
        }
    },
})

// Action creators are generated for each case reducer function
export const { toggleDrawer, setQueryPassMatched } = logiCloseSlice.actions
export const logicloseState = (store => store.logiCloseReducer)
export default logiCloseSlice.reducer