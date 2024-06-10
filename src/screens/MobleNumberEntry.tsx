import * as React from 'react';
import { StyleSheet,View, ImageBackground,Alert } from 'react-native';
import { useTheme, Text, Button } from 'react-native-paper';
import axios from 'axios';

import EveryOneVoteMatter from '../components/EveryOneVoteMatter';
import PhoneInput from 'react-native-phone-number-input';
import LinearGradient from 'react-native-linear-gradient';
import Navigation from '../Navigation';
import auth from '@react-native-firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { FirebaseAuthState, handleMobileConfirmation } from '../store/reducers/firebaseAuth';


const image = require('../../assets/mobile-number-entry.png')

const MobileNumberEntry = ({route,navigation}) => {
    const { colors } = useTheme();
    const phoneInput = React.useRef<PhoneInput>(null);

    const [phoneNumber,setphoneNumber]= React.useState("");
    const mobileConfirmationResult = useSelector((state:FirebaseAuthState) => state.firebaseAuth.mobileConfirmationResult);
    const dispatch = useDispatch();

    const authHandler = () => {
        const mobileNumber = `+${phoneInput.current.state.code}${phoneNumber}`
        // sendConfirmationCode(mobileNumber)
        dispatch(handleMobileConfirmation(mobileNumber))
    }

    React.useEffect(()=>{
        if(mobileConfirmationResult){
            console.log('Navigating')
            const mobileNumber = `+${phoneInput.current.state.code}${phoneNumber}`
            console.log("Success sign in ", mobileConfirmationResult)
            navigation.navigate('OTPVerify',{mobileNumber: mobileNumber})
        }

    },[mobileConfirmationResult])

    return (
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>

            <View style={styles.container}>
                <EveryOneVoteMatter />
                <View style={styles.mobileNumber}>
                    <Text style={styles.enterMobileNumberLabel}>Enter your mobile number</Text>
                    <View style={styles.enterMobileNumber}>
                        <Text style={{ paddingBottom: 10,color:'#6A798A' }}>Mobile Number</Text>
                        <PhoneInput
                            ref={phoneInput}
                            // defaultValue={value}
                            defaultCode="SG"
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
            </View>
        </ImageBackground>

    );
};

export default MobileNumberEntry;

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