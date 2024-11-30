import { createSlice } from "@reduxjs/toolkit";

const initialState={
    currentUser:null,
    loading:false,
    error:false
}
const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart:(state)=>{state.loading=true},
        signinSuccess:(state,action)=>{
            state.currentUser=action.payload,
            state.loading=false,
            state.error=false
        },
        signinFailure:(state,action)=>{
            state.loading=false,
            state.error=action.payload
        },
        updateStart:(state)=>{state.loading=true},
        updateSuccess:(state,action)=>{
            state.currentUser=action.payload,
            state.loading=false,
            state.error=false
        },
        updateFailure:(state,action)=>{
            state.loading=false,
            state.error=action.payload
        },
        deleteStart:(state)=>{state.loading=true},
        deleteSuccess:(state,action)=>{
            state.currentUser=null,
            state.loading=false,
            state.error=false
        },
        deleteFailure:(state,action)=>{
            state.loading=false,
            state.error=action.payload
        },
        signoutStart:(state)=>{state.loading=true},
        signoutSuccess:(state,action)=>{
            state.currentUser=null,
            state.loading=false,
            state.error=false
        },
        signoutFailure:(state,action)=>{
            state.loading=false,
            state.error=action.payload
        }

    }
});
export const{signInStart,signinSuccess,signinFailure,updateStart,updateSuccess,updateFailure,deleteFailure,deleteStart,deleteSuccess,signoutStart,signoutSuccess,signoutFailure}=userSlice.actions;
export default userSlice.reducer;
