import React, { useEffect } from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {theme} from './src/Theme';
import {AuthProvider} from './src/hooks/AuthProvider';
import Navigation from './src/Navigation';
import firebase from '@react-native-firebase/app';
import { Alert, PermissionsAndroid, Platform } from 'react-native';


// Create a react-query client
const queryClient = new QueryClient();


const RNfirebaseConfig = {
  apiKey: "AIzaSyDAUeYjcLnTXRt6hGBpVOcB7myWThxqR7g",
  authDomain: "vcampaign-c35f7.firebaseapp.com",
  projectId: "vcampaign-c35f7",
  storageBucket: "vcampaign-c35f7.appspot.com",
  // messagingSenderId: ".....",
  appId: "1:96887720920:android:71318301053537791c40ad"
};



//   let app;
//   if (firebase.apps.length === 0) {
//       app = firebase.initializeApp(RNfirebaseConfig)
//   } else {
//       app = firebase.app()
//   }

firebase.initializeApp(RNfirebaseConfig)

const App = () => {

  useEffect(()=> {
    locationPermission();
  },[])

  const locationPermission = async()=> {
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
      } else {
        Alert.alert('LOCATION Permission Denied');
      }
    } else {

    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PaperProvider theme={theme}>
          <Navigation />
        </PaperProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;