import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit"
import { type ApplicationVerifier, signInWithPhoneNumber, getAuth, type ConfirmationResult, PhoneAuthProvider, signInWithCredential } from "firebase/auth"

const createSlice = buildCreateSlice({ creators: { asyncThunk: asyncThunkCreator } });

interface AuthState {
    isSigningIn: boolean;
    isSubmittingValidationCode: boolean;
};

const initialState: AuthState = {
    isSigningIn: false,
    isSubmittingValidationCode: false
};

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: create => ({
        signin: create.asyncThunk<string, { phoneNumber: string; applicationVerifier: ApplicationVerifier; }>(
            async (props, thunkApi) => {
                try {
                    const { verificationId } = await signInWithPhoneNumber(getAuth(), props.phoneNumber, props.applicationVerifier);
                    return verificationId;
                } catch (error) {
                    throw thunkApi.rejectWithValue(error);
                }
            },
            {
                pending: (state) => { state.isSigningIn = true; },
                settled: (state) => { state.isSigningIn = false; }
            }
        ),
        submitConfirmationResult: create.asyncThunk<void, { verificationCode: string; verificationId: string; }>(
            async (props, thunkApi) => {
                try {
                    const credential = PhoneAuthProvider.credential(props.verificationId, props.verificationCode);
                    await signInWithCredential(getAuth(), credential);
                } catch (error) {
                    throw thunkApi.rejectWithValue(error);
                }
            },
            {
                pending: (state) => { state.isSubmittingValidationCode = true; },
                settled: (state) => { state.isSubmittingValidationCode = false; }
            }
        )
    })
});

export const { reducer } = slice;
export const { signin, submitConfirmationResult } = slice.actions;