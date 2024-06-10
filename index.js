/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import MyProfile from './src/screens/MyProfile';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';

AppRegistry.registerComponent(appName, () => App);