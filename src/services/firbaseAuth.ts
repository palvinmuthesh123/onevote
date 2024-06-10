import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

const confirmMobileNumber = async (phoneNumber) => {
    try {
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        // console.log("sendConfirmationCode success", confirmation);
        debugger
        Promise.resolve(confirmation)
    } catch (err) {
        debugger
        // console.log("sendConfirmationCode error", err.message)
        // Alert.alert('Mobile Number Verification Error', err.message, [
        //     {
        //         text: 'Cancel',
        //         onPress: () => console.log('Cancel Pressed'),
        //         style: 'cancel',
        //     }
        // ]);
        throw new Error(err)
    }
};

const confirmOTP = async (verificationCode, confirmationResult) => {
    try {
        const userCredential = await confirmationResult.confirm(verificationCode);
        console.log(userCredential.user)
        Promise.resolve(userCredential.user);
    } catch (err) {
        // Alert.alert('OTP Confirmation Error', err.message, [
        //     {
        //         text: 'Cancel',
        //         onPress: () => console.log('Cancel Pressed'),
        //         style: 'cancel',
        //     }
        // ]);
        throw new Error(err)
    }
};

export { confirmMobileNumber, confirmOTP }