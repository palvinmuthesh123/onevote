import * as React from 'react';
import { StyleSheet,View, ImageBackground,Alert, TouchableOpacity } from 'react-native';
import { useTheme, Text, Button, Icon } from 'react-native-paper';
import axios from 'axios';

import EveryOneVoteMatter from '../components/EveryOneVoteMatter';
import PhoneInput from 'react-native-phone-number-input';
import LinearGradient from 'react-native-linear-gradient';
import Navigation from '../Navigation';
import auth from '@react-native-firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { FirebaseAuthState, handleMobileConfirmation } from '../store/reducers/firebaseAuth';
import { OtpInput } from 'react-native-otp-entry';
import { confirmMobileNumber, confirmOTP } from '../services/firbaseAuth';
import { validateMobileNumber } from '../api/user';
import { storeData } from '../services/asyncStorage';
import { useAuth } from '../hooks/AuthProvider';
import { getNearByInstitutions } from '../api/institutions';


const image = require('../../assets/mobile-number-entry.png')

const Login = ({route,navigation}) => {
    const { colors } = useTheme();
    const phoneInput = React.useRef<PhoneInput>(null);

    const [phoneNumber,setphoneNumber]= React.useState("");
    const [callingCode, setCallingCode] = React.useState("");
    
    const [mobileNumberConfirmed,setMobileNUmberConfirmed] = React.useState(false)
    const [OTPHandler, setOTPHandler] = React.useState(Object)
    const [formattedMobileNumber, setFormattedMObileNUmber] = React.useState("")
    const [otp, setOtp] = React.useState("")
    const {signin} = useAuth();


    const authHandler = () => { 
        const mobileNumber = `+${phoneInput.current.state.code}${phoneNumber}`
        // setMobileNUmberConfirmed(true);
        // setFormattedMObileNUmber(mobileNumber)
        setCallingCode(`+${phoneInput.current.getCallingCode()}`)
        auth().signInWithPhoneNumber(mobileNumber).then(res => {
            console.log("mobileNumber Confirmed")
            setOTPHandler(res);
            setMobileNUmberConfirmed(true);
            setFormattedMObileNUmber(mobileNumber)
            
        }).catch(err => {
            console.log(err.message)
            Alert.alert('Mobile Number Verification Error', err.message, [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                }
            ]);
        })
    }

    const authHandler1 = () => { 
        const mobileNumber = `+${callingCode}${phoneNumber}`
        auth().signInWithPhoneNumber(mobileNumber).then(res => {
            console.log("mobileNumber Confirmed")
        }).catch(err => {
            console.log(err.message)
        })
    }

    const otpHandler = () => {
        validateMobileNumber({countryCode:callingCode,mobile: phoneNumber}).then(response => {
            console.log("api res validateMobileNumber ", response)
            storeData("token", response.token)
            // if(response.userExists)
            // {
            //     signin({
            //         id:"id",
            //         name:"name",
            //         email:"email",
            //         access_token:response.token,
            //         refresh_token:"refresh_token",
            //     });
            // }
            // else
            // {
                getNearByInstitutions({lat:'15.3173',long:'75.7139'}).then(res => {
                    console.log('getNearByInstitutions', res)
                    storeData('nearbyinst', res.data)
                    if(response.userExists == "false"){
                        navigation.navigate('Register')
                    }else{
                        signin({
                            id:"id",
                            name:"name",
                            email:"email",
                            access_token:response.token,
                            refresh_token:"refresh_token",
                            });
                    }
                }).catch(err => {
                    console.log('getNearByInstitutions', err)
                    // signin({
                    //     id:"id",
                    //     name:"name",
                    //     email:"email",
                    //     access_token:response.token,
                    //     refresh_token:"refresh_token",
                    // });
                })
            // }
        }).catch(err => {
            console.log("api err validateMobileNumber ", err)
        })
        // OTPHandler.confirm(otp).then(res => {
        //     console.log(res);
        //     navigation.navigate('Register')
        // }).catch(err => {
        //     Alert.alert('OTP Confirmation Error', err.message, [
        //         {
        //             text: 'Cancel',
        //             onPress: () => console.log('Cancel Pressed'),
        //             style: 'cancel',
        //         }
        //     ]);
        // })
    }

    return (
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>

            <View style={styles.container}>
                <EveryOneVoteMatter />
                {!mobileNumberConfirmed &&
                    <View style={styles.mobileNumber}>
                        <Text style={styles.enterMobileNumberLabel}>Enter your mobile number</Text>
                        <View style={styles.enterMobileNumber}>
                            <Text style={{ paddingBottom: 10,color:'#6A798A' }}>Mobile Number</Text>
                            <PhoneInput
                                ref={phoneInput}
                                // defaultValue={value}
                                value={phoneNumber}
                                defaultCode="IN"
                                layout="first"
                                onChangeText={(text) => {
                                    setphoneNumber(text);
                                }}
                                // onChangeFormattedText={(text) => {
                                // setFormattedValue(text);
                                // }}
                                withDarkTheme
                                withShadow
                            // autoFocus
                            />
                        </View>
                        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#73AF00', '#F47D20']} style={styles.submitButton}>
                            <Button icon="chevron-right" contentStyle={{flexDirection: 'row-reverse'}} textColor={'white'} labelStyle={{fontSize:28}} onPress={()=>{authHandler()}}>
                                <Text style={styles.submitButtonText}>PROCEED TO VERIFY </Text>
                            </Button>
                        </LinearGradient>
                    </View>
                }
                {mobileNumberConfirmed &&
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
                                <Text style={styles.mobileNumberText}>{formattedMobileNumber}</Text>
                            </View>
                            <TouchableOpacity onPress={()=> {setMobileNUmberConfirmed(false);}}>
                                <Icon source="circle-edit-outline" size={17} color='#903D00'></Icon>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.didntReceiveCode}>
                        <Text>Didn’t Receive Code? </Text>
                        <TouchableOpacity onPress={()=> {authHandler1()}}>
                            <Text style={{ color: '#003AD0',textDecorationLine:'underline' }}>Get a New one</Text>
                        </TouchableOpacity>
                    </View>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#73AF00', '#F47D20']} style={styles.submitButton}>
                        <Button icon="check-circle-outline" contentStyle={{flexDirection: 'row-reverse'}} textColor={'white'} labelStyle={{fontSize:20}} onPress={()=>{otpHandler()}}>
                            <Text style={styles.submitButtonText}>VERIFY AND CONTINUE</Text>
                        </Button>
                    </LinearGradient>
                </View>
                }
            </View>
        </ImageBackground>

    );
};

export default Login;

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
    mobileNumber: {
        flex: 1
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
        // flex: 4,
        justifyContent: 'center',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 29,
        borderRadius: 100,
        height: '12%',
        width:'95%'
    },
    submitButtonText: {
        color:'white',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24
    }
});