/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from  "@react-native-firebase/messaging"

if (!__DEV__) {
  console.log = () => {};
  console.error = () => {};
  console.warn = () => {};
}


messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📩 Background message handled:', remoteMessage);
});
AppRegistry.registerComponent(appName, () => App);
