import * as React from 'react';
import { StyleSheet, View, ImageBackground, KeyboardAvoidingView, FlatList, Image, Modal, TouchableOpacity, TextInput, Platform, PermissionsAndroid, Alert } from 'react-native';
import { useTheme, Text, Button, Icon } from 'react-native-paper';
import axios from 'axios';

import EveryOneVoteMatter from '../components/EveryOneVoteMatter';
import LinearGradient from 'react-native-linear-gradient';
import { OtpInput } from 'react-native-otp-entry';
import { Formik } from 'formik';
import DropDown from 'react-native-paper-dropdown';
import { useAuth } from '../hooks/AuthProvider';
import { getOrganization } from '../api/organization';
import { getMe } from '../api/profile';
import { getNearByInstitutions } from '../api/institutions';
import { getToken } from '../utils/token';
import { updateProfile } from '../api/updateprofile';
import DocumentPicker, {
    isInProgress,
    types,
} from 'react-native-document-picker';
import * as ImagePicker from 'react-native-image-picker';
import { updateProfilePic } from '../api/updateprofilePic';
import Geolocation from 'react-native-geolocation-service';

const image = require('../../assets/profile-details.png')
const orgImage = require('../../assets/institution.png')
const agentImage = require('../../assets/agent.png')

const MyProfile = () => {
    const [successModal, setSuccessModal] = React.useState(false)
    const [display, setDisplay] = React.useState(false)
    const [ind, setInd] = React.useState()
    const [propic, setProPic] = React.useState()
    const [texts, setTexts] = React.useState(['', '', '', '', '', '', '']);
    const [showDropDown, setShowDropDown] = React.useState(false);
    const [org, setOrg] = React.useState([])
    const [agnt, setAgnt] = React.useState([])
    const [gender, setGender] = React.useState(null);
    const [name, setName] = React.useState('');
    const [nameChange, setNameChange] = React.useState(false);
    const genderList = [
        {
            label: "Male",
            value: "MALE",
        },
        {
            label: "Female",
            value: "FEMALE",
        },
        {
            label: "Others",
            value: "OTHERS",
        },
    ];
    var [pro, setPro] = React.useState([
        {
            'que': 'Gender',
            'img': require('../../assets/Gender.png'),
            'ans': 'Male',
        },
        {
            'que': 'Birthday',
            'img': require('../../assets/Calender.png'),
            'ans': '7-7-1981',
        },
        {
            'que': 'Email',
            'img': require('../../assets/Mail.png'),
            'ans': 'msdhooni@gmail.com',
        },
        {
            'que': 'Phone Number',
            'img': require('../../assets/Phone.png'),
            'ans': '+91 9089089080',
        },
        {
            'que': 'Address',
            'img': require('../../assets/Lock.png'),
            'ans': 'New Delhi',
        },
        {
            'que': 'Local Agent',
            'img': require('../../assets/Agents.png'),
            'ans': 'Manish dhooni',
        },
        {
            'que': 'Organization',
            'img': require('../../assets/Agents.png'),
            'ans': 'Chennai Super Kings',
        },
    ])
    const [data, setData] = React.useState({})

    React.useEffect(async () => {
        await locationPermission();
        await getProfile();
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

    const getInstitutes = () => {
        Geolocation.getCurrentPosition(
            position => {
                // console.log(position);
                getNearByInstitutions({ lat: position?.coords?.latitude.toString(), long: position?.coords?.longitude.toString() }).then(res => {
                    console.log('getNearByInstitutions', res)
                    // setOrg(res?.data);
                    var arr = []
                    for (var i = 0; i < res?.data?.length; i++) {
                        var opo = res?.data[i]
                        opo['label'] = res?.data[i]?.name
                        opo['value'] = res?.data[i]?._id
                        opo['index'] = i
                        arr.push(opo)
                    }
                    setOrg(arr)
                    var arr1 = []
                    for (var j = 0; j < arr[0]?.agents?.length; j++) {
                        var opo1 = arr[0]?.agents[j]
                        opo1['label'] = arr[0]?.agents[j]?.name
                        opo1['value'] = arr[0]?.agents[j]?._id
                        opo1['index'] = j
                        arr.push(opo1)
                    }
                    setAgnt(arr1)
                }).catch(err => {
                    // console.log('getNearByInstitutions', err)
                })
            },
            error => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
    }

    const getProfile = async () => {
        await getMe()
            .then(res => {
                console.log(res, "IO")
                setData(res.data);
                setName(res?.data?.name)
                setAgnt(res?.data?.agent || res?.data?.institution?.agents)
                // console.log(res?.data?.profilePic.split('profile/'))
                if (res?.data?.profilePic.includes('profile/')) {
                    setProPic(res?.data?.profilePic.split('profile/')[0] + 'media/' + res?.data?.profilePic.split('profile/')[1])
                }
                else {
                    setProPic(res?.data?.profilePic)
                }
                setPro([
                    {
                        'que': 'Gender',
                        'img': require('../../assets/Gender.png'),
                        'ans': res.data?.gender,
                    },
                    {
                        'que': 'Birthday',
                        'img': require('../../assets/Calender.png'),
                        'ans': '7-7-1981',
                    },
                    {
                        'que': 'Email',
                        'img': require('../../assets/Mail.png'),
                        'ans': res.data?.email,
                    },
                    {
                        'que': 'Phone Number',
                        'img': require('../../assets/Phone.png'),
                        'ans': res.data?.countryCode + " " + res.data?.mobile,
                    },
                    {
                        'que': 'Address',
                        'img': require('../../assets/Lock.png'),
                        'ans': res.data?.address,
                    },
                    {
                        'que': 'Organization',
                        'img': require('../../assets/Agents.png'),
                        'ans': res.data?.institution?.name,
                    },
                    {
                        'que': 'Local Agent',
                        'img': require('../../assets/Agents.png'),
                        'ans': res?.data?.agent?.name || res?.data?.institution?.agents?.name,
                    },
                ])
            })
    }

    const Saves = async () => {
        
        let params: any = {}

        name != "" ? params.name = name : null
        texts[0] != "" ? params.gender = texts[0] : null
        texts[1] != "" ? params : null
        texts[2] != "" ? params.email = texts[2] : null
        texts[3] != "" ? params : null
        texts[4] != "" ? params.address = texts[4] : null
        texts[5] != "" ? params.institution = texts[5] : null
        texts[6] != "" ? params.agent = texts[6] : null

        await updateProfile(params).then(res => {
            if (res.success) {
                getProfile();
                setInd();
                setNameChange(false);
                setDisplay(false);
            }
        }).catch(err => {
            // console.log('getNearByInstitutions', err)
        })
    }

    const Changing = (val) => {
        // console.log(val, "LLLLLLLLLLLLLLLL")
        var arr1 = []
        for (var i = 0; i < pro.length; i++) {
            if (i == ind && i == 5) {
                arr1[i] = {
                    'que': pro[i].que,
                    'img': pro[i].img,
                    'ans': val,
                }
                arr1[6] = {
                    'que': pro[i].que,
                    'img': pro[i].img,
                    'ans': agnt.length!=0 ? agnt[0].name : ""
                }
            }
            else if (i == ind) {
                arr1[i] = {
                    'que': pro[i].que,
                    'img': pro[i].img,
                    'ans': val,
                }
            }
            else {
                arr1[i] = pro[i]
            }
        }
        setPro(arr1);
        console.log(arr1, "PPPPPPPPPP")
        var arr = texts
        for (var i = 0; i < arr.length; i++) {
            if (i == ind && ind == 5) {
                var orgg = ""
                org.map((item, index) => {
                    if (item.name == val) {
                        orgg = item?._id
                    }
                })
                arr[i] = orgg
            }
            else if (i == ind && ind == 6) {
                var text = ""
                agnt.map((item, index) => {
                    if (item.name == val) {
                        text = item?._id
                    }
                })
                arr[i] = text
            }
            else if (i == ind) {
                arr[i] = val
            }
            else {
                arr[i] = arr[i]
            }
        }
        setTexts(arr)
        // console.log(arr, "QQQQQQQQQ")
    }

    const changePhoto = async (val) => {
        let data = {
            name: val?.fileName || val?.name,
            type: val?.type,
            uri: Platform.OS === 'ios'
                ? val?.uri.replace('file://', '')
                : val?.uri,
        };
        await updateProfilePic({ data: data })
            .then(res => {
                if (res.success) {
                    getProfile();

                }
            })
    }

    const cameraPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'One Vote Camera Permission',
                    message: 'One Vote needs access to your camera',
                    buttonPositive: 'Allow',
                    buttonNegative: 'Cancel',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                await launchCamera();
            } else {
                Alert.alert('CAMERA Permission Denied');
            }
        } else {
            await launchCamera();
        }
    };

    const launchCamera = async () => {
        try {
            let options = {
                storageOptions: {
                    skipBackup: true,
                    path: 'images',
                },
                includeBase64: true,
                maxWidth: 640,
                maxHeight: 480,
                compressImageQuality: 1,
            };
            await ImagePicker.launchCamera(options, async response => {
                // console.log(' launchCamera Response =  ', response.assets[0]);
                setProPic(response?.assets[0]?.uri)
                changePhoto(response.assets[0]);
                try {
                    // console.log('Canceled image request ', response.didCancel);

                    let data = {
                        name: response.assets[0].fileName,
                        type: response.assets[0].type,
                        uri:
                            Platform.OS === 'ios'
                                ? response.assets[0].uri.replace('file://', '')
                                : response.assets[0].uri,
                    };

                } catch (e) {
                    console.error('Catch err >>> ', e);
                }
            });
        } catch (error) {
            // console.log('first', error);
        }
    };

    function filePicker() {
        DocumentPicker.pick({
            type: types.images,
        })
            .then(async res => {
                // console.log('Response  filePicker ', res);
                setProPic(res[0].uri)
                changePhoto(res[0])
                // res[i]
            })
            .catch(handleError);
    }

    const handleError = err => {
        if (DocumentPicker.isCancel(err)) {
            console.warn('cancelled', err);
        } else if (isInProgress(err)) {
            console.warn(
                'multiple pickers were opened, only the last will be considered',
                err,
            );
        } else {
            // console.log('err', err);
            throw err;
        }
    };

    const Drops = (res) => {
        // console.log(res)
        if (ind == 5) {
            var text = ""
            org.map((item, index) => {
                if (item._id == res) {
                    text = item?.name
                    var arr = []
                    for (var i = 0; i < item?.agents?.length; i++) {
                        var opo = item?.agents[i]
                        opo['label'] = item?.agents[i]?.name
                        opo['value'] = item?.agents[i]?._id
                        opo['index'] = i
                        arr.push(opo)
                    }
                    setAgnt(arr)
                    Changing(item?.name)
                }
            })
        } else if (ind == 6) {
            agnt.map((item, index) => {
                if (item._id == res) {
                    text = item?.name
                    Changing(item?.name)
                }
            })
        } else if (ind == 2) {
            Changing(res)
        }
    }

    return (
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>
            <KeyboardAvoidingView style={styles.container} behavior='padding'>
                <View style={{ flex: 1 }}>
                    <EveryOneVoteMatter />
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <TouchableOpacity onPress={() => { setSuccessModal(true) }} style={{ width: '30%' }}>
                            <Image source={propic && propic != "No-profilepic" ? { uri: propic } : agentImage} style={[{ borderRadius: 50 }, propic && propic != "No-profilepic" ? { height: 75, width: 75 } : {}]} />
                        </TouchableOpacity>
                        <View style={{ width: '70%' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {nameChange ? <TextInput style={[{ marginRight: 20, width: 105 }]} value={name ? name : ''} onChangeText={(val) => {
                                    setName(val)
                                }}></TextInput> :
                                    <Text style={styles.user}>{name ? name : ''}</Text>}
                                <TouchableOpacity onPress={() => { setNameChange(true); setDisplay(true); }}>
                                    <Image style={{ marginLeft: 10 }} source={require('../../assets/Edit.png')} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.Atuser}>@{name.toLowerCase()}</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: "5%" }}>
                        <FlatList
                            data={pro}
                            keyExtractor={item => item}
                            renderItem={({ item, index }) =>
                                index!=1 ?<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: '8%' }}>
                                    <View style={{ width: '10%' }}>
                                        <Image source={item && item.img ? item.img : null} style={{ height: 20, width: 20 }} resizeMode='contain' />
                                    </View>
                                    <View style={{ width: '40%' }}>
                                        <Text style={[styles.user, { color: "black" }]}>{item && item.que ? item.que : ""}</Text>
                                    </View>
                                    <View style={{ width: '50%', flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
                                        {ind == index ? (ind == 5 || ind == 6 || ind == 0) ? <DropDown
                                            label={
                                                ind == 0 ? item && item.ans ? item.ans : "Gender" : 
                                                ind == 5 ? item && item.ans ? item.ans : "Institute" : 
                                                ind == 6 ? item && item.ans ? item.ans : "Agents" : ""
                                            }
                                            mode={"flat"}
                                            visible={showDropDown}
                                            showDropDown={() => setShowDropDown(true)}
                                            onDismiss={() => setShowDropDown(false)}
                                            value={item && item.ans ? item.ans : ""}
                                            setValue={Drops}
                                            list={
                                                ind == 0 ? genderList : 
                                                ind == 5 ? org : 
                                                ind == 6 ? agnt : []
                                            }
                                            inputProps={{
                                                style: styles.textInput
                                            }}
                                        /> :
                                            <TextInput style={[{ marginRight: 20, width: 105 }]} value={item && item.ans ? item.ans : ""} onChangeText={(val) => {
                                                Changing(val)
                                            }}></TextInput>
                                            : <Text style={[styles.Atuser, { marginRight: 20 }]}>{item && item.ans ? item.ans : ""}</Text>}
                                        {index!=3 ? <TouchableOpacity onPress={() => { setInd(index); setDisplay(true); setNameChange(false); }}>
                                            <Image source={require('../../assets/Edit.png')} />
                                        </TouchableOpacity> : null}
                                    </View>
                                </View> : null
                            }/>
                            {display ? <View style={{ alignItems: "center", justifyContent: "center", }}>
                                <TouchableOpacity onPress={() => {
                                    Saves()
                                }} style={styles.submitButton}>
                                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#73AF00', '#F47D20']} style={styles.submitButton}>
                                    <Text style={styles.submitButtonText}>SAVE </Text>
                                    <Image source={require('../../assets/Tick.png')} style={{ width: 20, height: 20, marginLeft: 5, }} />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View> : null}
                    </View>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={successModal}
                    onRequestClose={() => {
                        setSuccessModal(!successModal)
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity onPress={() => { setSuccessModal(!successModal) }} style={{ flexDirection: "row", width: '100%', justifyContent: "flex-end", }}>
                                <Image source={require('../../assets/Wrong.png')} style={{ width: 17, height: 17, }} />
                            </TouchableOpacity>
                            <View style={{ alignItems: "center", justifyContent: "center", }}>
                                <TouchableOpacity onPress={() => {
                                    filePicker()
                                }} style={styles.submitButton}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#73AF00', '#F47D20']} style={styles.submitButton}>
                                        <Text style={styles.submitButtonText}>UPLOAD PHOTO </Text>
                                        <Image source={require('../../assets/Tick.png')} style={{ width: 20, height: 20, marginLeft: 5, }} />
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center", }}>
                                <TouchableOpacity onPress={() => {
                                    cameraPermission()
                                }} style={styles.submitButton}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#73AF00', '#F47D20']} style={styles.submitButton}>
                                        <Text style={styles.submitButtonText}>OPEN CAMERA </Text>
                                        <Image source={require('../../assets/Tick.png')} style={{ width: 20, height: 20, marginLeft: 5, }} />
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default MyProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        fontFamily: 'Poppins',
        padding: '5%'
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    user: {
        fontSize: 15,
        fontWeight: "700",
        color: "#223263"
    },
    Atuser: {
        fontSize: 13,
        fontWeight: "600",
        color: "#9098B1",
        marginTop: 5
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
        // marginTop: 22,
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        // height:'80%',
        width: '90%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    submitButton: {
        justifyContent: 'center',
        alignItems: "center",
        flexDirection: "row",
        // fontSize: 16,
        // fontWeight: '400',
        // lineHeight: 29,
        borderRadius: 100,
        height: 50,
        width: '95%',
        marginVertical: '5%',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '400',
        // lineHeight: 24
    },
    textInput: {
        backgroundColor: 'transparent',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 29,
        height: 50
    },
});