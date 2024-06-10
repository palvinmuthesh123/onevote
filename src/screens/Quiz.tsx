import * as React from 'react';
import { StyleSheet, View, ImageBackground, KeyboardAvoidingView, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useTheme, Text, Button, Icon, TextInput } from 'react-native-paper';
import axios from 'axios';
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
import { ScrollView } from 'react-native-gesture-handler';
import { storeData } from '../services/asyncStorage';
import { completeEvent } from '../api/completeevent';

const image = require('../../assets/profile-details.png')
const orgImage = require('../../assets/institution.png')
const agentImage = require('../../assets/agent.png')

const Quiz = (props, {navigation}) => {

  const [ans,setAns] = React.useState(
    [
      {'opt':'A','ans':'5'},
      {'opt':'B','ans':'6'},
      {'opt':'C','ans':'4'},
    ])
  const [ind, setInd] = React.useState(null)
  const [opt, setOpt] = React.useState(['A', 'B', 'C', 'D', 'E'])
  const [item ,setItem] = React.useState({
    "_id": "",
    "title": "",
    "description": "",
    "startDate": "",
    "endDate": "",
    "startTime": "",
    "endTime": "",
    "eventType": "",
    "poll": {
        "_id": "",
        "question": "",
        "options": [],
        "answeredBy": [],
        "__v": 0
    },
    "subscribedUsers": [],
    "completedUsers": [],
    "__v": 0
  })

  React.useEffect(()=>{
    // console.log(props)
    setItem(props.route.params.item)
  },[])

  async function complete() {
    let params = {
      id: item._id
    }
    await completeEvent({ data: params })
        .then(res => {
            if (res.success) {
              console.log(res, "OOO")
              storeData('modal', "true");
              props.navigation.push('InsideStack')
              // Alert.alert(res.message)
            }
        }).catch((err)=> {
          console.log(err)
            // Alert.alert("Some error occured while completion...")
            storeData('modal', "true");
            props.navigation.push('InsideStack')
        })
  }

  return (
    <ImageBackground source={image} resizeMode="cover" style={styles.image}>
      <View style={{ flex: 0.03 }} />
        <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1}}>
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
              <Image source={orgImage} style={{ borderRadius: 50 }} />
              <Text style={{ color: '#003AD0', fontSize: 10, fontWeight: '500' }}>Manifesto</Text>
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Image source={agentImage} style={{ borderRadius: 50 }} />
              <Text style={{ color: '#003AD0', fontSize: 10, fontWeight: '500' }}>MSDhoni</Text>
            </View>
          </View>
          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <Text style={styles.welcomeLabel}>Welcome to </Text>
            <Text style={[styles.welcomeLabel, { color: '#F47D20' }]}>ONE</Text>
            <Text style={[styles.welcomeLabel, { color: '#006CF4' }]}>Vote</Text>
          </View>
          <View style={{alignItems:"center",justifyContent:"center"}}>
            <Text style={styles.number}>1 of 20</Text>
            <Text style={styles.question}>{item && item.poll && item.poll.question ? item.poll.question : ""}</Text>
            <Image source={require('../../assets/org.jpg')} style={{width: '100%', height: 150,marginTop:'5%',borderRadius:10 }}/>
            <View style={{width:'100%'}}>
            <FlatList
              data={item.poll.options}
              keyExtractor={item => item}
              renderItem={({ item, index }) =>
              <TouchableOpacity onPress={()=> setInd(index)} style={[styles.tollBox, ind==index ? {borderColor: "#6FB825"} : {}]}>
                <Text style={styles.answer}>{opt[index]}. {item}</Text>
              </TouchableOpacity>
            }/>
            </View>
            <View style={{alignItems:"center",justifyContent:"center",width:'100%', marginBottom: 20}}>
              <TouchableOpacity onPress={()=> {
                if(ind!=null && item.poll.options.length!=0) {
                  // storeData('modal', "true");
                  // props.navigation.push('InsideStack')
                  complete();
                }
                else if (item.poll.options.length==0) {
                  // storeData('modal', "true");
                  // props.navigation.push('InsideStack')
                  complete();
                }
                else {
                  Alert.alert('Please Select One Option')
                }
              }} style={styles.submitButton}>
                <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#73AF00', '#F47D20']} style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>CONTINUE </Text>
                    <Image source={require('../../assets/Tick.png')} style={{width: 20, height: 20, marginLeft: 5,}}/>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
    </ImageBackground>
  );
};


export default Quiz;

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
  welcomeLabel: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 27
  },
  tollBox:{
    borderWidth:1,
    borderColor:"#BEBAB3",
    borderRadius:10,
    width:'100%',
    height:50,
    marginTop:'5%',
    justifyContent:"center",
    paddingHorizontal:'5%'
  },
  enterMobileNumber: {
    paddingBottom: '15%',
    justifyContent: 'flex-start',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 29
  },
  number:{
    color:'#78746D',
    fontSize:16,
    fontWeight:"600",
    marginTop:'5%',
  },
  question:{
    color:'#3C3A36',
    fontSize:16,
    fontWeight:"600",
    marginTop:'5%',
    width:'95%',
    textAlign:"center"
  },
  answer:{
    color:'#3C3A36',
    fontSize:16,
    fontWeight:"600",
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
    flexDirection:"row",
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
  statusMsg: {
    // flex:,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Poppins'
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