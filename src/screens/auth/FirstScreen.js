import {View, Text, SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../assets/colors';
import styles from '../../assets/styles';
import {getUserInfo} from '../../utils/function';
import DeviceInfo from 'react-native-device-info';
import UpdateModal from '../../component/shared/UpdateModal';
import {get, post} from '../../utils/requestBuilder';
import messaging from '@react-native-firebase/messaging';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Settings, AppEventsLogger} from 'react-native-fbsdk-next';

const FirstScreen = ({navigation}) => {
  const [currentVersion, setCurrentVersion] = useState('');
  const [isLatestVersion, setIsLatestVersion] = useState(null);
  const [userData, setUserData] = useState(null);
  const [currentFCMToken, setCurrentFCMToken] = useState('');

  const getToken = async () => {
    try {
      const token = await messaging().getToken();
      setCurrentFCMToken(token);
    } catch (error) {
      console.log(`error while getting token ${error}`);
    }
  };

 useEffect(() => {
    Settings.initializeSDK();
    AppEventsLogger.logEvent("fb_mobile_activate_app");
  }, []);


  useEffect(() => {
    getToken();
    fetchCurrentVersion();
    fetchUserData();
  }, []);

  useEffect(() => {
    if (currentVersion) {
      fetchLatestVersion();
    }
  }, [currentVersion]);

  const fetchCurrentVersion = async () => {
    try {
      const appVersion = await DeviceInfo.getVersion();
      setCurrentVersion(appVersion);
    } catch (error) {
      console.error('Error while fetching current version:', error);
    }
  };

  const fetchLatestVersion = async () => {
    try {
      const url = `api/v1/user/fetch/app-version`;
      const {response} = await get(url);
      const latestVersion = response.response;
      setIsLatestVersion(currentVersion === latestVersion);
    } catch (error) {
      console.error(`Error while fetching latest version: ${error}`);
    }
  };

  const fetchUserData = async () => {
    try {
      const userInfo = await getUserInfo();
      setUserData(userInfo);
    } catch (error) {
      console.error('Error while fetching user data:', error);
    }
  };

  const fetchFCMToken = async (userId, FCMToken) => {
    try {
      const body = {
        userId,
        FCMToken,
      };
      const url = `api/v1/user/handle/fcm-token`;
      const {response, status} = await post(url, body);
      if (status === 200) {
        const responseData = response.response;
        if (responseData.toUpdate === false) {
          return null;
        } else if (responseData.toUpdate === true) {
          const newToken = responseData.token;
          // Fetch current user data from EncryptedStorage
          let userData = JSON.parse(await EncryptedStorage.getItem('userData'));
          if (userData) {
            // Update the FCMToken at the base level and user level
            userData.FCMToken = newToken; // Base level
            userData.user.FCMToken = newToken; // User level
            // Save updated user data back to EncryptedStorage
            const updatedToken = await EncryptedStorage.setItem(
              'userData',
              JSON.stringify(userData),
            );
          }
        }
      } else {
        console.log('Error: status is not 200 while operating with FCM token');
      }
    } catch (error) {
      console.log(`Error while fetching user FCM token: ${error}`);
    }
  };

  useEffect(() => {
    const handleNavigation = async () => {
      if (isLatestVersion !== null) {
        if (isLatestVersion) {
          if (userData) {
            const {_id} = userData.user;
            fetchFCMToken(_id, currentFCMToken);
            await new Promise(resolve => setTimeout(resolve, 100));
            navigation.replace('Home');
          } else {
            await new Promise(resolve => setTimeout(resolve, 100));
            goToMobileNumber();
          }
        }
      }
    };

    handleNavigation();
  }, [isLatestVersion, userData]);

  const goToMobileNumber = () => {
    navigation.replace('MobileNumber');
  };

  return (
    <SafeAreaView
      style={[{flex: 1, borderWidth: 1, backgroundColor: colors.mintGreen}]}>
      <View style={[{justifyContent: 'center', alignItems: 'center', flex: 1}]}>
        {isLatestVersion === false && <UpdateModal />}
        <Text style={[{fontSize: 100, color: colors.white}]}>XSale</Text>
        <Text style={[{color: colors.white}, styles.ts20]}>
          Buy Better, Sell Faster
        </Text>
        <Text
          style={[
            ,
            {color: colors.white, bottom: 40, position: 'absolute'},
            styles.mt12,
          ]}>
          A Sky Technologies Product
        </Text>
        <Text
          style={[
            ,
            {color: colors.white, bottom: 15, position: 'absolute'},
            styles.mt12,
          ]}>
          skytechnologies.solutions@gmail.com
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default FirstScreen;
