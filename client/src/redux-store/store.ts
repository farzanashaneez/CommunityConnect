import {combineReducers, configureStore} from '@reduxjs/toolkit';
import userReducer from './user/userSlice.js'
import adminReducer from './user/adminSlice.js';

import {persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootreducer=combineReducers({user:userReducer,admin:adminReducer});


const persistConfig={
    key:'root',
    version:1,
    storage,
}
const persistedReducer=persistReducer(persistConfig,rootreducer)


export const store=configureStore({
    reducer:persistedReducer,
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck:false,
    })
})
export const persistor=persistStore(store);