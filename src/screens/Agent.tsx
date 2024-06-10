import * as React from 'react';
import { StyleSheet, View, ImageBackground, KeyboardAvoidingView, Image } from 'react-native';
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
import { getMe } from '../api/profile';


const image = require('../../assets/profile-details.png')
const orgImage = require('../../assets/bank.png')
const agentImage = require('../../assets/agent1.png')

const Agent = () => {

  const [agent, setAgent] = React.useState()
  const [organization, setOrganization] = React.useState()
  const [agentName, setAgentName] = React.useState()
  const [organizationName, setOrganizationName] = React.useState()

  React.useEffect(async()=> {
    await getMe()
    .then(res => {
    console.log(res.data)
    setAgent(res?.data?.agent?.image)
    setAgentName(res?.data?.agent?.name);
    setOrganization(res?.data?.institution?.image);
    setOrganizationName(res?.data?.institution?.name);
  })
  },[])

  return (
    <ImageBackground source={image} resizeMode="cover" style={styles.image}>
      <View style={styles.container}>
        <EveryOneVoteMatter />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: '5%' }}>
          <View style={{ flexDirection: 'column',alignItems:'center' }}>
            <Image source={organization && organization!="No-Image" ? {uri: organization} : orgImage} style={[{ borderRadius: 50, width: 73, height: 73, }, organization ? {} : {resizeMode: 'stretch', borderRadius:0}]} />
            <Text style={{color:'#003AD0',fontSize:10,fontWeight:'500'}}>{organizationName ? organizationName : 'Organization'}</Text>
          </View>
          <View style={{ flexDirection: 'column',alignItems:'center' }}>
            <Image source={agent ? {uri: agent} : agentImage} style={[{ borderRadius: 50 },{width: 73, height: 73,},agent ? {} : {resizeMode: 'stretch', borderRadius:0}]} />
            <Text style={{color:'#003AD0',fontSize:10,fontWeight:'500'}}>{agentName ? agentName : 'Agent'}</Text>
          </View>
        </View>
        <View style={{alignItems:'center'}}>
          <Text style={styles.manifesto}>Agent Manifesto</Text>
          <Text style={styles.manifestoContent}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Agent;

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
  enterMobileNumber: {
    paddingBottom: '15%',
    justifyContent: 'flex-start',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 29
  },
  manifesto:{
    fontSize:18,
    fontWeight:'500',
    lineHeight:27,
    marginBottom:'10%'
  },
  manifestoContent:{
    fontSize:11,
    fontWeight:'400',
    lineHeight:22
  }
});