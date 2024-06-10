import * as React from 'react';
import { StyleSheet, View, ImageBackground, KeyboardAvoidingView, Alert, TouchableOpacity } from 'react-native';
import { useTheme, Text, Button, Icon } from 'react-native-paper';
import axios from 'axios';

import EveryOneVoteMatter from '../components/EveryOneVoteMatter';
import LinearGradient from 'react-native-linear-gradient';
import { OtpInput } from 'react-native-otp-entry';
import { useDispatch, useSelector } from 'react-redux';
import { FirebaseAuthState, handleOTPConfirmationResult } from '../store/reducers/firebaseAuth';
import auth from '@react-native-firebase/auth';

const image = require('../../assets/mobile-number-entry.png')

const VerifyOTP = ({route,navigation}) => {
    const { colors } = useTheme();
    const {mobileNumber} = route.params
    const OTPConfirmationResult = useSelector((state:FirebaseAuthState) => state.firebaseAuth.codeConfirmationResult);
    const dispatch = useDispatch();


    const [otp, setOtp] = React.useState("")

    const verifyOTP = () => {
        // console.log("function", func)
        dispatch(handleOTPConfirmationResult(otp))

    }

    React.useEffect(()=>{
        if(OTPConfirmationResult){
            console.log(OTPConfirmationResult)
            navigation.navigate('Register')
        }
    },[OTPConfirmationResult])

    const authHandler = () => { 
        auth().signInWithPhoneNumber(mobileNumber).then(res => {
            console.log("mobileNumber Confirmed")
        }).catch(err => {
            console.log(err.message)
        })
    }

    return (
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>
            <KeyboardAvoidingView style={styles.container} behavior='padding'>
                <EveryOneVoteMatter />
                <View style={{ flex: 1 }}>
                    <Text style={styles.enterMobileNumberLabel}>Verify Phone Number</Text>
                    <View style={styles.enterMobileNumber}>
                        <Text style={{ paddingBottom: 10, color: '#6A798A' }}>
                            We have sent you a 6 digit code. Please enter here to Verify your Number.
                        </Text>
                            <OtpInput
                                numberOfDigits={6}
                                onTextChange={(text) => console.log(text)}
                                focusColor="green"
                                focusStickBlinkingDuration={500}
                                onFilled={(text) => setOtp(text)}
                                autoFocus={false}
                                theme={{
                                    containerStyle: { marginBottom: '5%' },
                                    // inputsContainerStyle: {borderColor:'#EAEAEA',borderRadius:5},
                                    pinCodeContainerStyle: { borderColor: '#EAEAEA', borderRadius: 5, width: '16%', borderWidth: 3 },
                                    pinCodeTextStyle: {color:'black'},
                                    // focusStickStyle: styles.focusStick,
                                    // focusedPinCodeContainerStyle: styles.activePinCodeContainer
                                }}
                            />
                        <View style={styles.mobileNumberEdit}>
                            <View style={styles.mobileNumberBG}>
                                <Text style={styles.mobileNumberText}>{mobileNumber}</Text>
                            </View>
                            <TouchableOpacity onPress={()=>{navigation.navigate('Login')}}>
                                <Icon source="circle-edit-outline" size={17} color='#903D00'></Icon>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.didntReceiveCode}>
                        <Text>Didn’t Receive Code? </Text>
                        <TouchableOpacity onPress={()=> {authHandler()}}>
                            <Text style={{ color: '#003AD0',textDecorationLine:'underline' }}>Get a New one</Text>
                        </TouchableOpacity>
                    </View>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#73AF00', '#F47D20']} style={styles.submitButton}>
                        <Button icon="check-circle-outline" contentStyle={{flexDirection: 'row-reverse'}} textColor={'white'} labelStyle={{fontSize:20}} onPress={()=>{verifyOTP()}}>
                            <Text style={styles.submitButtonText}>VERIFY AND CONTINUE</Text>
                        </Button>
                    </LinearGradient>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default VerifyOTP;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        fontFamily: 'Poppins',
        padding: 30
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    enterMobileNumberLabel: {
        paddingBottom: '5%',
        justifyContent: 'flex-start',
        fontSize: 22,
        fontWeight: '400',
        lineHeight: 29
    },
    enterMobileNumber: {
        paddingBottom: '15%',
        justifyContent: 'flex-start',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 29
    },
    mobileNumberEdit: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    mobileNumberBG: {
        borderRadius: 50,
        backgroundColor: '#EFF2F5',
        padding: '2%'
    },
    mobileNumberText: {
        lineHeight: 23,
        fontSize: 17,
        fontWeight: '400'
    },
    didntReceiveCode: {
        fontSize:16,
        fontWeight:"400",
        lineHeight:23,
        color:'#6A798A',
        flexDirection:'row',
        justifyContent:'center',
        marginBottom: '5%'
    },
    submitButton: {
        justifyContent: 'center',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 29,
        borderRadius: 100,
        height: '12%',
        width: '95%'
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24
    }
});