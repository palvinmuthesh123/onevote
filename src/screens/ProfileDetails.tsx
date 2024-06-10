import * as React from 'react';
import { StyleSheet, View, ImageBackground, KeyboardAvoidingView, Image, Platform, PermissionsAndroid, Alert, TouchableOpacity } from 'react-native';
import { useTheme, Text, Button, Icon, TextInput } from 'react-native-paper';
import axios from 'axios';

import EveryOneVoteMatter from '../components/EveryOneVoteMatter';
import LinearGradient from 'react-native-linear-gradient';
import { OtpInput } from 'react-native-otp-entry';
import { Formik } from 'formik';
import DropDown from 'react-native-paper-dropdown';
import { useAuth } from '../hooks/AuthProvider';
import { getOrganization } from '../api/organization';
import { getNearByInstitutions } from '../api/institutions';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import Geolocation from 'react-native-geolocation-service';
import { updateProfile } from '../api/updateprofile';

const image = require('../../assets/profile-details.png')
const orgImage = require('../../assets/institution.png')
const agentImage = require('../../assets/agent1.png')

const ProfileDetails = () => {
    const { colors } = useTheme();
    const [showDropDown, setShowDropDown] = React.useState(false);
    const [showDropDown1, setShowDropDown1] = React.useState(false);
    const [gender, setGender] = React.useState(null);
    const [org, setOrg] = React.useState();
    const [agt, setAgt] = React.useState();
    const [address, setAddress] = React.useState('');
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const { signin } = useAuth();
    const [data, setData] = React.useState([])
    const [data1, setData1] = React.useState([])
    const genderList = [
        {
            label: "Male",
            value: "male",
        },
        {
            label: "Female",
            value: "female",
        },
        {
            label: "Others",
            value: "others",
        },
    ];

    React.useEffect(() => {
        locationPermission();
    }, [])

    const locationPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'One Vote Location Permission',
                    message: 'One Vote needs access to your location',
                    buttonPositive: 'Allow',
                    buttonNegative: 'Cancel',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                getInstitutes();
            } else {
                Alert.alert('LOCATION Permission Denied');
            }
        } else {

        }
    };

    // React.useEffect(() => {
    //     if (org) {
    //         var arr = data.filter(function (event) {
    //             return event._id == org;
    //         })
    //         setData1(arr);
    //     }
    // }, [org]);

    const getInstitutes = () => {
        Geolocation.getCurrentPosition(
            position => {
                console.log(position);
                getNearByInstitutions({ lat: position?.coords?.latitude.toString(), long: position?.coords?.longitude.toString() }).then(res => {
                    console.log('getNearByInstitutions', res)
                    var arr = []
                    for (var i = 0; i < res?.data?.length; i++) {
                        var opo = res?.data[i]
                        opo['label'] = res?.data[i]?.name
                        opo['value'] = res?.data[i]?._id
                        opo['index'] = i
                        arr.push(opo)
                    }
                    setData(arr);
                    // setOrg(arr[0]?.name)
                    var arr1 = []
                    for (var j = 0; j < arr[0].agent?.length; j++) {
                        var opo1 = arr[0].agent[j]
                        opo1['label'] = arr[0].agent[j]?.name
                        opo1['value'] = arr[0].agent[j]?._id
                        opo1['index'] = j
                        arr.push(opo1)
                    }
                    setData1(arr1)
                }).catch(err => {
                    console.log('getNearByInstitutions', err)
                })
            },
            error => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
    }

    const navigateToHome = () => {
        signin({
            id: "id",
            name: "name",
            email: "email",
            access_token: "access_token",
            refresh_token: "refresh_token",
        });
    }

    const setOrgs = (val) => {
        console.log(val);
        setOrg(val);
        var filteredEvents = data.filter(function (event) {
            return event._id == val;
        });
        setData1(filteredEvents)
        // data.map((item, index) => {
        //     if (item._id == val) {
        //         // var arr = []
        //         // for (var i = 0; i < item?.agents?.length; i++) {
        //         //     var opo = item?.agents[i]
        //         //     opo['label'] = item?.agents[i]?.name
        //         //     opo['value'] = item?.agents[i]?._id
        //         //     opo['index'] = i
        //         //     arr.push(opo)
        //         // }
        //     setData1(item?.agents)
        //     }
        // })
    }

    const Saves = async () => {

        let params: any = {}

        name != "" ? params.name = name : null
        email != "" ? params.email = email : null
        address != "" ? params.address = address : null
        agt != null ? params.agent = agt : (data1 && data1?._id) ? data1?._id : null
        org != null ? params.institute = org : (data && data?._id) ? data?._id : null
        console.log(params)
        // await updateProfile(params).then(res => {
        //     console.log(res, "RRRRRRRRRRR")
        //     if (res.success) {
        //         navigateToHome();
        //     }
        // }).catch(err => {
        //     console.log('getNearByInstitutions', err)
        // })
    }

    return (
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>
            <KeyboardAvoidingView style={styles.container} behavior='padding'>
                <View style={{ flex: 1 }}>
                    <EveryOneVoteMatter />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: '5%' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={orgImage} style={{ borderRadius: 50 }} />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={agentImage} style={{ borderRadius: 50, height: 73, width: 73 }} />
                        </View>
                    </View>
                    <Text style={styles.enterMobileNumberLabel}>Enter Profile Details</Text>
                    <View style={styles.enterMobileNumber}>
                        <Formik
                            initialValues={{ email: '', address: '', name: '' }}
                            onSubmit={values => console.log(values)}
                        >
                            {({ handleChange, handleBlur, values }) => (
                                <View>
                                    <DropDown
                                        label={"Organization"}
                                        mode={"flat"}
                                        visible={showDropDown}
                                        showDropDown={() => setShowDropDown(true)}
                                        onDismiss={() => setShowDropDown(false)}
                                        value={org}
                                        setValue={setOrgs}
                                        list={data}
                                        inputProps={{
                                            style: styles.textInput
                                        }}
                                    />
                                    <DropDown
                                        label={"Local Agent"}
                                        mode={"flat"}
                                        visible={showDropDown1}
                                        showDropDown={() => setShowDropDown1(true)}
                                        onDismiss={() => setShowDropDown1(false)}
                                        value={agt}
                                        setValue={setAgt}
                                        list={data1.map(group => ({ label: group.name, value: group._id }))}
                                        inputProps={{
                                            style: styles.textInput
                                        }}
                                    />
                                    <TextInput
                                        label='Name'
                                        onChangeText={setName}
                                        onBlur={handleBlur('name')}
                                        value={name}
                                        style={styles.textInput}
                                        right={<TextInput.Icon icon={'account'} color={'#298E44'} />}
                                    />
                                    <TextInput
                                        label='Email'
                                        onChangeText={setEmail}
                                        onBlur={handleBlur('email')}
                                        value={email}
                                        style={styles.textInput}
                                        right={<TextInput.Icon icon={'email-outline'} color={'#298E44'} />}
                                    />
                                    <TextInput
                                        label='Address'
                                        onChangeText={setAddress}
                                        onBlur={handleBlur('address')}
                                        value={address}
                                        style={styles.textInput}
                                        right={<TextInput.Icon icon={'map-marker-outline'} color={'#298E44'} />}
                                    />
                                    {/* <TextInput
                                        label='Upload Profile Picture'
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        value={values.email}
                                        style={styles.textInput}
                                        right={<TextInput.Icon icon={'tray-arrow-up'} color={'#298E44'}/>}
                                    /> */}
                                </View>

                            )}
                        </Formik>
                    </View>
                    <TouchableOpacity style={styles.submitButton} onPress={() => { Saves() }}>
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#73AF00', '#F47D20']} style={[styles.submitButton, { height: '100%' }]}>
                            <Button icon="check-circle-outline" contentStyle={{ flexDirection: 'row-reverse' }} textColor={'white'} labelStyle={{ fontSize: 20 }}>
                                <Text style={styles.submitButtonText}>SAVE AND CONTINUE</Text>
                            </Button>
                        </LinearGradient>
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center' }}>
                        <Button icon="chevron-double-right" mode="text" textColor={'#003AD0'} contentStyle={{ flexDirection: 'row-reverse' }} onPress={() => { Saves() }}>
                            Skip for now
                        </Button>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default ProfileDetails;

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
        // paddingBottom: '5%',
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
    textInput: {
        backgroundColor: 'transparent',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 29,
        height: 50
    },
    submitButton: {
        justifyContent: 'center',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 29,
        borderRadius: 100,
        height: '8%',
        width: '95%',
        marginBottom: '5%'
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24
    }
});