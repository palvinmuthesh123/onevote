import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from './hooks/AuthProvider';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

// Screens
import SignIn from './screens/auth/SignIn';
import Home from './screens/Home';
import Gallery from './screens/Gallery';
import Settings from './screens/Settings';
import MobileNumberEntry from './screens/MobleNumberEntry';
import VerifyOTP from './screens/VerifyOTP';
import ProfileDetails from './screens/ProfileDetails';
import MyProfile from './screens/MyProfile';
import { Image } from 'react-native';
import Organization from './screens/Organization';
import Agent from './screens/Agent';
import Login from './screens/Login';
import Quiz from './screens/Quiz';

// Icons for Bottom Tab Navigation
const profileIcon = ({ color }: { focused: boolean; color: string }) => (
  <Icon name="account-outline" size={20} color={color} />
);
const organizationIcon = ({ color }: { focused: boolean; color: string }) => (
  <Icon name="domain" size={20} color={color} />
);
const agenProfileIcon = ({ color }: { focused: boolean; color: string }) => (
  <Icon name="account-settings-outline" size={20} color={color} />
);

export default function Navigation() {
  const { user } = useAuth();

  function InsideStack() {
    return (
      <Tab.Navigator barStyle={{ backgroundColor: '#D9E4D4' }} activeColor='#77A383' inactiveColor='#86B383'>
        <Tab.Screen
          name="my_profile"
          component={Home}
          options={{
            tabBarIcon: ({ focused, color, }) => {
              return (
                <Image
                  source={
                    focused
                      ? require('../assets/profile.png')
                      : require('../assets/profile.png')
                  }
                />
              );
            },
            tabBarLabel: 'My Profile',
          }}
        />
        <Tab.Screen
          name="org_profile"
          component={Organization}
          options={{
            tabBarIcon: ({ focused, color, }) => {
              return (
                <Image
                  source={
                    focused
                      ? require('../assets/organization.png')
                      : require('../assets/organization.png')
                  }
                />
              );
            },
            tabBarLabel: 'Organization',
            tabBarAccessibilityLabel: 'My Profile'
          }}
        />
        <Tab.Screen
          name="agent_profile"
          component={Agent}
          options={{
            tabBarIcon: ({ focused, color, }) => {
              return (
                <Image
                  source={
                    focused
                      ? require('../assets/AgentIcon.png')
                      : require('../assets/AgentIcon.png')
                  }
                />
              );
            },
            tabBarLabel: 'Agent Profile'
          }}
        />
        <Tab.Screen
          name="More"
          // component={Settings}
          component={MyProfile}
          options={{
            tabBarIcon: ({ focused, color, }) => {
              return (
                <Image
                  source={
                    focused
                      ? require('../assets/more.png')
                      : require('../assets/more.png')
                  }
                />
              );
            },
            tabBarLabel: 'More'
          }}
        />
      </Tab.Navigator>
    )
  }
  
  function OutsideStack() {
    const [otpConfirm, setOTPConfirm] = React.useState();
    const handleMobileEntryVerify = (confirmation) => {
      console.log("handleMobileEntryVerify", confirmation)
      setOTPConfirm(confirmation)
    }
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={!user.access_token ? "" : "InsideStack"}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="MobileRegister" component={MobileNumberEntry} />
        <Stack.Screen name="OTPVerify" component={VerifyOTP} />
        <Stack.Screen name="Register" component={ProfileDetails} />
        <Stack.Screen name="Quiz" component={Quiz} />
        <Stack.Screen name="InsideStack" component={InsideStack} />
        {/* <Stack.Screen name="MyProfile" component={MyProfile} /> */}
      </Stack.Navigator>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/* {!user.access_token ? (
          <OutsideStack />
        ) : (
          <InsideStack />
        )} */}
        <OutsideStack/>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
