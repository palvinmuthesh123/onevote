import { createSlice } from '@reduxjs/toolkit';
import { confirmMobileNumber, confirmOTP } from '../../services/firbaseAuth';
import { Alert } from 'react-native';

export interface FirebaseAuthState {
    firebaseAuth: {
        mobileConfirmationResult: Object;
        mobileConfirmationError:Error;
        codeConfirmationResult:Object;
        codeConfirmationError:Error;
    }
}
const initialState = {
    mobileConfirmationResult: null,
    mobileConfirmationError: null,
    codeConfirmationResult: null,
    codeConfirmationError: null
};

const counterSlice = createSlice({
    name: 'firbaseAuth',
    initialState,
    reducers: {
        handleMobileConfirmation(state, action) {
            confirmMobileNumber(action.payload).then(res => {
                console.log("handleMobileConfirmation success", res)
                state.mobileConfirmationResult = res
                state.mobileConfirmationError = null
            }).catch(err => {
                console.log("handleMobileConfirmation error", err)
                state.mobileConfirmationError = err
                state.mobileConfirmationResult = null
            })
        },
        handleOTPConfirmationResult(state,action) {
            confirmOTP(action.payload,state.mobileConfirmationResult).then(res => {
                console.log("handleOTPConfirmationResult success", res)
                state.codeConfirmationResult = res
                state.codeConfirmationError = null
            }).catch(err => {
                console.log("handleOTPConfirmationResult error", err)
                state.codeConfirmationError = err
                state.codeConfirmationResult = null
            })
        }
        // Add more reducers as needed
    },
});

export const { handleMobileConfirmation, handleOTPConfirmationResult} = counterSlice.actions;
export default counterSlice.reducer;