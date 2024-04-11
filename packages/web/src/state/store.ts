import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { reducer as authReducer } from "./slices/auth.js";

const reducer = combineReducers({
    authReducer
});

export const store = configureStore({ reducer });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;