import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View, ImageBackground, KeyboardAvoidingView, Image, FlatList, TouchableOpacity, Modal, Linking, ScrollView, Platform, PermissionsAndroid, Alert, TextInput } from 'react-native';
import { useTheme, Text, Button, Icon } from 'react-native-paper';
import axios from 'axios';
import Video from 'react-native-video';
import EveryOneVoteMatter from '../components/EveryOneVoteMatter';
import LinearGradient from 'react-native-linear-gradient';
import { OtpInput } from 'react-native-otp-entry';
import { Formik } from 'formik';
import DropDown from 'react-native-paper-dropdown';
import { useAuth } from '../hooks/AuthProvider';
import Slider from "react-native-hook-image-slider"
import { SliderBox } from "react-native-image-slider-box";
import { getToken } from '../utils/token';
import { getOnBoarding } from '../api/onboarding';
import { getEvents } from '../api/events';
import { fetchData, storeData } from '../services/asyncStorage';
import { getMe } from '../api/profile';
import DocumentPicker, {
  isInProgress,
  types,
} from 'react-native-document-picker';
import * as ImagePicker from 'react-native-image-picker';
import { competitionImage } from '../api/competitionimage';
import { WebView } from 'react-native-webview';
import YoutubePlayer from "react-native-youtube-iframe";
import { registerEvents } from '../api/registerEvent';
import RenderHtml from 'react-native-render-html';

const image = require('../../assets/profile-details.png')
const orgImage = require('../../assets/bank.png')
const agentImage = require('../../assets/agent1.png')

const ProfileDetails = ({ props, navigation }) => {
  const intervalRef = useRef(null);
  const [values, setValues] = React.useState({})
  const [banner, setBanners] = React.useState([])
  const [data, setData] = React.useState([])
  const [hide, setHide] = React.useState(true)
  const [detailOpen, setOpenDetail] = React.useState(false)
  const [title, setTitle] = React.useState('')
  const [item, setItem] = React.useState('')
  const [items, setItems] = React.useState('')
  const [desc, setDesc] = React.useState('')
  const [successModal, setSuccessModal] = React.useState(false)
  const [complete, setComplete] = React.useState(false)
  const [successModal1, setSuccessModal1] = React.useState(false)
  const [agent, setAgent] = React.useState()
  const [organization, setOrganization] = React.useState()
  const [agentName, setAgentName] = React.useState()
  const [organizationName, setOrganizationName] = React.useState()
  const [uLinkPage, setULinkPage] = React.useState(false)
  const [formPage, setFormPage] = React.useState(false)
  const [stop, setStop] = useState(false)
  const [url, setUrl] = useState("")
  const [photoList, setPhotoList] = React.useState([])
  const [videoUrl, setVideoUrl] = useState("")
  const [id, setId] = useState("")
  const [compData, setCompData] = useState({})


  React.useEffect(async () => {
    await getOnBoarding()
      .then(async res => {
        var arr = []
        if(res[0].images.length!=0)
        {
          for (var i = 0; i < res[0].images.length; i++) {
            const gets = await checkImageLink(res[0].images[i])
              .then((isValid) => {
                if (isValid) {
                  console.log("Image link is working.");
                  arr.push(res[0].images[i]);
                } else {
                  arr.push(require('../../assets/org.jpg'));
                }
              });
            console.log(gets);
          }
        }
        else
        {
          arr.push(require('../../assets/org.jpg'));
        }
        setBanners(arr);
      })
    const modals = await fetchData('modal')
    if (modals == "true") {
      setComplete(true);
      setSuccessModal(true);
      setHide(false);
      storeData('modal', "false");
    }
    else if (modals == null || modals == undefined || modals == "false") {

    }

    await getMe()
      .then(res => {
        // console.log(res.data, "YYYYYYYYYYYYYYYYYYYY")
        setId(res?.data?._id)
        setAgent(res?.data?.agent?.image)
        setAgentName(res?.data?.agent?.name);
        setOrganization(res?.data?.institution?.image);
        setOrganizationName(res?.data?.institution?.name);
      })

    // setTimeout(()=> {
    //   setHide(false)
    // },3000)

    // const intervalId = intervalRef.current = setInterval(() => {
    getEvents()
      .then(res => {
        setData(res.data)
      })
    // }, 1000);

    // return () => clearInterval(intervalId);
  }, [])

  const checkImageLink = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      return response.ok;
    } catch (error) {
      console.error("Error checking image link:", error);
      return false;
    }
  };

  function getImageDetails(imageUrl) {
    return new Promise((resolve, reject) => {
      Image.getSize(imageUrl, (width, height) => {
        const fileName = imageUrl.split('/').pop();
        const extension = imageUrl.split('.').pop();
        const platformAdjustedUrl = Platform.OS === 'android' ? imageUrl : imageUrl.replace('file://', '');
        const imageSize = Platform.OS === 'android' ? require('react-native-fs').stat(platformAdjustedUrl).size : -1;

        resolve({
          name: fileName,
          size: imageSize,
          extension: extension,
          width: width,
          height: height
        });
      }, error => {
        reject(error);
      });
    });
  }

  const setDatas = () => {
    getImageDetails(url)
          .then(details => {
              console.log('Image details:', details);
              var sets = {
                image: {uri: url}, 
                title: details?.name+''+details?.extention, 
                size: details?.size
              }
              var arr = photoList
              arr.push(sets)
              setPhotoList(arr);
          })
          .catch(error => {
              Alert.alert("Provide the working URL");
    });
  }

  function getIDfromURL(url) {
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  
    const match = url.match(regExp);
  
    if (match && match[2].length === 11) {
      return match[2];
    }
  
    console.log('The supplied URL is not a valid youtube URL');
  
    return '';
  }

  async function registers(item) {
    let params = {
      id: item._id,
      uid: id
    }
    await registerEvents({ data: params })
        .then(res => {
            if (res.success) {
              console.log(res, "OOO")
              setSuccessModal(true);
              // Alert.alert(res.message)
            }
        }).catch((err)=> { 
          console.log(err)
            Alert.alert("Some error occured while registration...")
        })
  }

  const renderItem = ({ item }: { item: any }) => {

    var dates = new Date() < new Date(item.startDate)
    if (dates) {
      var { days, hours, minutes, seconds } = dateDifference(new Date(item.startDate));
    }

    return (
      dates ?
      <View style={{ width: '84%', marginLeft: '8%', backgroundColor: 'white', elevation: 2, borderRadius: 10, marginVertical: 10, padding: 10 }}>
        <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
          <Image source={require('../../assets/clock.png')} style={{ width: 15, height: 15, marginRight: 5 }} />
          <Text style={{ color: "#6FB825", fontSize: 10, marginRight: 3 }}>{days} {days < 1 ? 'days' : 'day'} {hours}:{minutes}:{seconds}</Text>
          <Text style={{ color: "black", fontSize: 10 }}>Left</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Image source={item.eventType == 'url' ? require('../../assets/video.png') : item.eventType == 'poll' ? require('../../assets/choose.png') : require('../../assets/palette.png')} style={{ width: 60, height: 60, marginRight: 15 }} />
          <View>
            <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: "#FE6F18", fontSize: 13, width: 200 }}>{item.title}</Text>
            <RenderHtml
              contentWidth={200}
              source={{html: 
                `<div style="width: 200px; font-size: 11px; max-height: 2em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${item.description}
                </div>
                `
              }}
            />
            {/* <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: '#818181', fontSize: 10, width: 200 }}>{item.description}</Text> */}

          </View>
        </View>
        <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
          <TouchableOpacity style={{ flexDirection: "row", }} onPress={() => {
            console.log(item)
            if (item.eventType == 'url') {
              // Linking.openURL(item.url.link);
              setVideoUrl(getIDfromURL(item.url.link));
              setItems(item);
              setULinkPage(true)
            }
            else if (item.eventType == 'poll') {
              setTitle(item.title); setDesc(item.description); setItem(item); setOpenDetail(true)
            }
            else if(item.eventType == 'competition') {
              // setULinkPage(false)
              if(item && item.competition && item.competition.answeredBy==id)
              {
                var sets = {
                  image: {uri: item.competition.attachment}, 
                  title: "", 
                  size: ""
                }
                var arr = photoList
                arr.push(sets)
                setPhotoList(arr);
              }
              setItem(item)
              setCompData(item.competition)
              setULinkPage(true)
              setHide(false)
              setFormPage(true)
            }
          }}>
            <Image source={require('../../assets/eye.png')} style={{ width: 13, height: 13, marginRight: 5 }} />
            <Text style={{ color: "#989898", fontSize: 10, marginRight: 10 }}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: "row", }} onPress={() => {
            var bool = true
            for(var i = 0; i<item.subscribedUsers.length; i++)
            {
              if(item.subscribedUsers[i]._id==id)
              {
                bool = false
              }
            }
            if(bool)
            {
              registers(item)
            }
            else
            {
              Alert.alert(
                'Already Registered',
                item.eventType == 'poll' ? 'Proceed to Poll' : "",
                [
                  {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                  {text: 'OK', onPress: ()=> {item.eventType == 'poll' ? 
                  navigation.navigate('Quiz', { item: item }) : null}},
                ],
                { cancelable: false }
              )
            }
          }}>
            <Image source={require('../../assets/user.png')} style={{ width: 13, height: 13, marginRight: 5, }} />
            <Text style={{ color: "#6FB825", fontSize: 10 }}>Register</Text>
          </TouchableOpacity>
        </View>
      </View> 
      : null
    );
  };

  const detailItem = () => {

    return (
      <View style={{ flex: 3.8 }}>
        <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: 20 }}>
        <TouchableOpacity onPress={()=> {setULinkPage(false); setOpenDetail(false);}} style={{alignSelf: 'flex-start', position: 'absolute', left: 50, marginTop: 5,}}><Image source={require('../../assets/back.png')} style={{width: 25, height: 25,alignSelf: 'flex-start'}}/></TouchableOpacity>
          <Text style={styles.welcomeLabel}>Welcome to </Text>
          <Text style={[styles.welcomeLabel, { color: '#F47D20' }]}>ONE</Text>
          <Text style={[styles.welcomeLabel, { color: '#006CF4' }]}>Vote</Text>
        </View>
        <Text style={{ fontSize: 20, fontWeight: '700', marginTop: 20, marginBottom: 10, marginLeft: '5%', color: '#0065E4' }}>{title}</Text>
        <View style={{ paddingHorizontal: "5%" }}>

          {/* <Text style={{ fontSize: 14, lineHeight: 27, }}>{desc}</Text> */}
          <RenderHtml
            // contentWidth='100%'
            source={{
              html: desc
            }}
          />
        </View>
        <View style={{ alignItems: "center", justifyContent: "center", }}>
          <TouchableOpacity onPress={() => {
            // registers(item);
            var bool = true
                  for(var i = 0; i<item.subscribedUsers.length; i++)
                  {
                    if(item.subscribedUsers[i]._id==id)
                    {
                      bool = false
                    }
                  }
                  if(bool)
                  {
                    registers(item)
                  }
                  else
                  {
                    Alert.alert(
                      'Already Registered',
                      item.eventType == 'poll' ? 'Proceed to Poll' : "",
                      [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                        {text: 'OK', onPress: ()=> {item.eventType == 'poll' ? 
                        navigation.navigate('Quiz', { item: item }) : null}},
                      ],
                      { cancelable: false }
                    )
                  }
            // clearInterval(intervalRef.current);
            // navigation.navigate('Quiz', { item: item })
          }} style={styles.submitButton}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#73AF00', '#F47D20']} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>REGISTER </Text>
              <Image source={require('../../assets/Tick.png')} style={{ width: 20, height: 20, marginLeft: 5, }} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const SuccessModal = () => {
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={successModal}
          onRequestClose={() => {
            setSuccessModal(!successModal)
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text>Hello</Text>
            </View>
          </View>
        </Modal>
      </View>
    )
  }

  const changePhoto = async (val) => {
    console.log(compData?._id, "CCCCCCCCCCCCCCc")
    let data = {
        id: compData?._id,
        name: val?.fileName || val?.name,
        type: val?.type,
        uri: Platform.OS === 'ios'
            ? val?.uri.replace('file://', '')
            : val?.uri,
    };
    await competitionImage({ data: data })
        .then(res => {
            if (res.success) {
                setOpenDetail(false);
                setULinkPage(false);
                setHide(false)
                Alert.alert("Your file has been submitted successfully !!!")
            }
            else {
                setOpenDetail(false);
                setULinkPage(false);
                setHide(false);
                Alert.alert("Your file is not submitted...")
            }
        }).catch((err)=> {
            Alert.alert("Some error occured while submission...")
        })
  }

  const Cancels = (ind) => {
    var arr = photoList;
    arr = arr.filter((item, index)=> {
      return index!=ind
    })
    console.log(arr)
    setPhotoList(arr);
  }

  const setStops = useCallback((state) => {
    if (state === "ended") {
      setStop(false);
    }
  }, []);

  const upage = () => {
    return (
      <View style={{ flex: 3.8, }}>
        <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
        <TouchableOpacity onPress={()=> {setULinkPage(false); setOpenDetail(false);}} style={{alignSelf: 'flex-start', position: 'absolute', left: 50, marginTop: 5,}}><Image source={require('../../assets/back.png')} style={{width: 25, height: 25,alignSelf: 'flex-start'}}/></TouchableOpacity>
          <Text style={styles.welcomeLabel}>Welcome to </Text>
          <Text style={[styles.welcomeLabel, { color: '#F47D20' }]}>ONE</Text>
          <Text style={[styles.welcomeLabel, { color: '#006CF4' }]}>Vote</Text>
        </View>
        {!formPage ?
          <>
            <Text style={{ fontSize: 20, fontWeight: '700', marginTop: '10%', marginBottom: 10, marginLeft: '5%', color: '#0065E4', }}>Youtube Link Competition</Text>
            <View style={{ paddingHorizontal: "5%", width: '100%', height: 200, justifyContent: "center", }}>
              {/* <Image source={require('../../assets/uTube.png')}/> */}
              {/* <Video
                source={{ uri: videoUrl }}
                // onBuffer={onBuffer}
                // onError={videoError}
                // onEnd={() => go()}
                style={styles.video}
                // controls={true}
                paused={stop ? true : false}
                fullscreen={true}
                resizeMode="cover"
              /> */}
              <YoutubePlayer
                height={300}
                play={stop}
                videoId={videoUrl}
                onChangeState={setStops}
              />
            </View>
            <View style={{ alignItems: "center", justifyContent: "center", }}>
              <TouchableOpacity
                // onPress={() => setFormPage(true)}
                onPress={() => {
                  var bool = true
                  for(var i = 0; i<items.subscribedUsers.length; i++)
                  {
                    if(items.subscribedUsers[i]._id==id)
                    {
                      bool = false
                    }
                  }
                  if(bool)
                  {
                    registers(items)
                  }
                  else
                  {
                    Alert.alert(
                      'Already Registered',
                      items.eventType == 'poll' ? 'Proceed to Poll' : "",
                      [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                        {text: 'OK', onPress: ()=> {items.eventType == 'poll' ? 
                        navigation.navigate('Quiz', { item: items }) : null}},
                      ],
                      { cancelable: false }
                    )
                  }
                }}
                style={styles.submitButton}>
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#73AF00', '#F47D20']} style={styles.submitButton}>
                  <Text style={styles.submitButtonText}>REGISTER </Text>
                  <Image source={require('../../assets/Tick.png')} style={{ width: 20, height: 20, marginLeft: 5, }} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
          :
          <>
            <Text style={{ fontSize: 20, fontWeight: '700', marginTop: '10%', marginBottom: 10, marginLeft: '5%', color: '#0065E4', }}>Arts Competition</Text>
            <TouchableOpacity onPress={() => {
              if(item && item.competition && item.competition.answeredBy == id)
              {
                Alert.alert("You have already answered!!!")
              }
              else
              {
                setSuccessModal1(true)
              }
            }} style={styles.dragBox}>
              <Image source={require('../../assets/backup.png')} style={{ height: 20, width: 30 }} />
              <Text style={styles.dragText}>Drag your file(s) or <Text style={{ fontWeight: '700', color: '#1849D6', }}>browse</Text></Text>
              <Text style={styles.dragText1}>Max 10 MB files are allowed</Text>
            </TouchableOpacity>
            <Text style={[styles.dragText1, { marginLeft: '5%', }]}>Only support .jpg, .png and files</Text>
            <View style={{ flexDirection: "row", justifyContent: 'space-evenly', alignItems: "center", marginVertical: '5%', marginHorizontal: '5%' }}>
              <Image source={require('../../assets/line.png')} style={{ width: 80, }} />
              <Image source={require('../../assets/Divider.png')} />
              <Image source={require('../../assets/line.png')} style={{ width: 80, }} />
            </View>
            <Text style={{ fontSize: 20, fontWeight: '700', marginTop: '3%', marginBottom: 10, marginLeft: '5%', color: '#000000', }}>Upload from URL </Text>
            <View style={styles.urlBox}>
              <TextInput
                style={[styles.dragText1, { width: '80%', height: 50 }]}
                placeholder='Add file URL'
                value={url}
                onChange={(res:any) => { console.log(res); setUrl(res); }}></TextInput>
              <TouchableOpacity onPress={()=> {
                 if(item && item.competition && item.competition.answeredBy == id)
                  {
                    Alert.alert("You have already answered!!!")
                  }
                  else
                  {
                    setDatas()
                  }
              }} style={styles.uploadBtn}>
                <Text style={styles.dragText2}>Upload</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginBottom: '5%', }}>
              <FlatList
                data={photoList}
                keyExtractor={item => item}
                renderItem={({ item, index }) =>
                  <View style={[styles.urlBox, { marginTop: 10 }]}>
                    <View style={{ width: '20%', }}>
                      <Image source={item.image} style={{ height: 50, width: 50, borderRadius: 5, }} />
                    </View>
                    <View style={{ width: '70%', paddingLeft: 10, }}>
                      <Text style={{ color: "#000000", fontWeight: '700', fontSize: 14 }}>{item.title}</Text>
                      <Text style={{ color: "#6D6D6D", fontWeight: '500', fontSize: 13, }}>{item.size}</Text>
                    </View>
                    <TouchableOpacity onPress={()=> {Cancels(index)}} style={{ width: '10%', }}>
                      <Image source={require('../../assets/Cancel.png')} style={{ height: 20, width: 20 }} />
                    </TouchableOpacity>
                  </View>
                } />
            </View>
          </>}
      </View>
    )
  }

  function dateDifference(endDateString) {
    const startDate = new Date();
    const endDate = new Date(endDateString);

    let timeDifference = endDate - startDate;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;

    return { days, hours: remainingHours, minutes: remainingMinutes, seconds: remainingSeconds };
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
        var sets = {
          image: {uri: response.assets[0].uri}, 
          title: response.assets[0].fileName, 
          size: response.assets[0].fileSize
        }
        var arr = photoList
        arr.push(sets)
        setPhotoList(arr);
        setSuccessModal1(false)
        changePhoto(response.assets[0])
      });
    } catch (error) {
      // console.log('first', error);
    }
  };

  function filePicker() {
    DocumentPicker.pick({
      type: types.images,
      // allowMultiSelection: true
    }).then(async res => {
      console.log(res) 
      var arr = photoList
      for(var i = 0; i<res.length; i++) {
        arr.push({
          image: {uri: res[0].uri}, 
          title: res[0].name, 
          size: res[0].size
        })
      }
      changePhoto(res[0])
      setPhotoList(arr);
      setSuccessModal1(false)
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

  return (
    <ImageBackground source={image} resizeMode="cover" style={styles.image}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 0.3 }} />
        <View style={styles.container}>
          <View style={styles.statusMsg}>
            <Text style={styles.header1}>
              <Text>{'Every '}</Text>
              <Text style={{ color: '#F47D20' }}>{'ONE'}</Text>
              <Text style={{ color: '#2360AD' }}>{'Vote '}</Text>
              <Text>{'Matters'}</Text>
            </Text>
            <Text style={styles.header2}>{'by vCampaign'}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: '5%' }}>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Image source={organization && organization != "No-Image" ? {uri: organization} : orgImage} style={[{ borderRadius: 50, width: 73, height: 73, }, organization ? {} : { resizeMode: 'stretch', borderRadius: 0 }]} />
              <Text style={{ color: '#003AD0', fontSize: 10, fontWeight: '500' }}>{organizationName ? organizationName : 'Organization'}</Text>
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Image source={agent ? { uri: agent } : agentImage} style={[{ borderRadius: 50, width: 73, height: 73, }, agent ? {} : { resizeMode: 'stretch', borderRadius: 0 }]} />
              <Text style={{ color: '#003AD0', fontSize: 10, fontWeight: '500' }}>{agentName ? agentName : 'Agent'}</Text>
            </View>
          </View>
          {hide ? <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
          {/* <TouchableOpacity style={{alignSelf: 'flex-start'}}><Image source={require('../../assets/back.png')} style={{width: 25, height: 25,alignSelf: 'flex-start'}}/></TouchableOpacity> */}
            <Text style={styles.welcomeLabel}>Welcome to </Text>
            <Text style={[styles.welcomeLabel, { color: '#F47D20' }]}>ONE</Text>
            <Text style={[styles.welcomeLabel, { color: '#006CF4' }]}>Vote</Text>
          </View> : null}
        </View>
        {hide ? <><SliderBox
          images={banner}
          onCurrentImagePressed={index =>
            console.warn(`image ${index} pressed`)
          }
          sliderBoxHeight={144}
          ImageComponentStyle={{ borderRadius: 15, width: '80%', padding: 0 }}
          resizeMethod={'resize'}
          resizeMode={'cover'}
          autoplay={true}
        /><View style={{ alignItems: "center", justifyContent: "center", }}>
            <TouchableOpacity onPress={() => {
              setHide(false)
              // setULinkPage(true)
              setOpenDetail(false)
            }} style={styles.submitButton}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#73AF00', '#F47D20']} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>EVENTS </Text>
                <Image source={require('../../assets/Tick.png')} style={{ width: 20, height: 20, marginLeft: 5, }} />
              </LinearGradient>
            </TouchableOpacity>
          </View></>
          : uLinkPage ? upage()
            : !detailOpen ?
              <View style={{ flex: 3.8 }}>
                <Text style={{ fontSize: 20, fontWeight: '600', textAlign: 'center', marginTop: 20 }}>Notification Center</Text>
                <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 10, marginLeft: '8%' }}>Upcoming Events</Text>
                <View style={{ height: '100%' }}>
                  <FlatList
                    data={data || []}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                  />
                </View>
              </View>
              : detailItem()}
        <View style={{ flex: 1.2, }} />
        <Modal
          animationType="slide"
          transparent={true}
          visible={successModal}
          // visible={true}
          onRequestClose={() => {
            setSuccessModal(!successModal)
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity onPress={() => { setSuccessModal(false) }} style={{ flexDirection: "row", width: '100%', justifyContent: "flex-end", }}>
                <Image source={require('../../assets/Wrong.png')} style={{ width: 17, height: 17, }} />
              </TouchableOpacity>
              <Image source={require('../../assets/Success.png')} style={{ width: 220, height: 200, marginTop: 30, marginRight: 20 }} />
              <Text style={styles.SuccessTitle}>{complete ? 'Event Completed' : 'Registered' } Successfully.</Text>
              <Text style={styles.SuccessContent}>In the meantime, stay tuned for any updates or additional information regarding the event.</Text>
              <TouchableOpacity onPress={() => { setSuccessModal(false); setComplete(false);}}>
                <Text style={styles.SuccessButton}>Back to home</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={successModal1}
          onRequestClose={() => {
            setSuccessModal1(!successModal1)
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity onPress={() => { setSuccessModal1(!successModal1) }} style={{ flexDirection: "row", width: '100%', justifyContent: "flex-end", }}>
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

      </ScrollView>
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
  dragBox: {
    marginHorizontal: "5%",
    width: '90%',
    height: 130,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1849D6",
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 10,
    justifyContent: "space-evenly",
  },
  dragText: {
    color: "black",
    fontSize: 15,
  },
  dragText1: {
    color: "#6D6D6D",
    fontSize: 14
  },
  dragText2: {
    color: "#6D6D6D",
    fontSize: 12,
    fontWeight: '700',
  },
  urlBox: {
    width: '90%',
    // height:70,
    padding: 15,
    marginHorizontal: "5%",
    // paddingHorizontal:"5%",
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "#E7E7E7",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  uploadBtn: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "#E7E7E7",
    borderWidth: 1,
  },
  welcomeLabel: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 27
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
  video: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '400',
    // lineHeight: 24
  },
  SuccessTitle: {
    color: "#181725",
    fontSize: 18,
    fontWeight: '600',
    marginTop: 30
  },
  SuccessContent: {
    color: "#7C7C7C",
    fontSize: 16,
    fontWeight: '600',
    marginTop: 30,
    textAlign: "center",
    width: '70%',
  },
  SuccessButton: {
    color: "#003AD0",
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 40,
    textAlign: "center"
    // width:'60%',
  },
  statusMsg: {
    // flex:,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Poppins'
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
  header1: {
    fontSize: 20,
    fontWeight: "500",
    lineHeight: 30,
    color: 'black',
    flexDirection: 'row'
  },
  header2: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    color: 'black',
  }
});