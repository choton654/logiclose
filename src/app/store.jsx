import { configureStore } from '@reduxjs/toolkit'
import logiCloseReducer from "../features/logicloseSlice"
import { api } from "../services/query"
import { setupListeners } from '@reduxjs/toolkit/query'

export const store = configureStore({
    reducer: {
        logiCloseReducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['logiclose/OpenMenu'],
                // Ignore these field paths in all actions
                // ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
                // Ignore these paths in the state
                ignoredPaths: ['logiCloseReducer.customize'],
            }
        }).concat(api.middleware),
})

setupListeners(store.dispatch)