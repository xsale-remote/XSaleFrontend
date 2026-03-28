import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  ToastAndroid,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from '../../assets/styles';
import colors from '../../assets/colors';
import { Button, TitleInput } from '../../component/shared';
import { post } from '../../utils/requestBuilder';
import EncryptedStorage from 'react-native-encrypted-storage';
import messaging from '@react-native-firebase/messaging';
import {
  BannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';
import { admobMobilenumberBanner } from "../../utils/env"
import { logEvent } from '../../utils/analytics';
import { CommonActions } from '@react-navigation/native';

const MobileNumber = ({ navigation, route }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [numberError, setNumberError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentFCMToken, setCurrentFCMToken] = useState('');

  const getToken = async () => {
    try {
      const token = await messaging().getToken();
      setCurrentFCMToken(token);
      console.log("FCM Token:", token);
      await messaging().subscribeToTopic('xsale_daily');
    } catch (error) {
      console.log(`error while getting token ${error}`);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  const signInWithPhoneNumber = async () => {
    if (mobileNumber.length !== 10) {
      setNumberError(true);
      return;
    }

    setNumberError(false);
    setLoading(true);
    logEvent('auth_phone_entered');

    try {
      const url = 'api/v1/user/check-user';
      const { response, status } = await post(url, {
        phoneNumber: `+91${mobileNumber}`,
      });

      const userExists = response?.response?._id;
      if (userExists) {
        const loginUrl = 'api/v1/user/login';
        const loginBody = {
          phoneNumber: mobileNumber,
          FCMToken: currentFCMToken,
        };

        const { response: loginResponse, status } = await post(
          loginUrl,
          loginBody,
        );
        if (status === 200) {
          await EncryptedStorage.setItem(
            'userData',
            JSON.stringify(loginResponse.response),
          );
          logEvent('login', { method: 'phone' });

          ToastAndroid.showWithGravityAndOffset(
            'Login Successfully',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );

          navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'MainTabs' }] }));
          setLoading(false);
        } else {
          ToastAndroid.show(
            'Login failed, please try again',
            ToastAndroid.SHORT,
          );
          setLoading(false);
        }
      } else {
        navigation.navigate('Location', { mobileNumber });
        setLoading(false);
      }
    } catch (error) {
      ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      setLoading(false);
    }
  };

  function filterInput(input) {
    const sanitizedInput = input.replace(/\D/g, '');
    return sanitizedInput;
  }

  const handleNumberChange = t => {
    const filteredInput = filterInput(t);
    setMobileNumber(filteredInput);
  };

  return (
    <SafeAreaView style={[styles.pdh16, { flex: 1 }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
          keyboardShouldPersistTaps="handled">
          <View
            style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
            <Text
              style={[
                styles.mb8,
                { fontSize: 30, color: colors.black },
                styles.fwBold,
              ]}>
              Welcome !
            </Text>
            <Text
              style={[
                { fontSize: 18, color: colors.black, textAlign: 'center' },
                styles.fwBold,
              ]}>
              Let's get started
            </Text>
          </View>
          <View style={{ flex: 0.5, justifyContent: 'flex-start' }}>
            <TitleInput
              inputPlaceholder={'Enter here'}
              title={'Mobile Number'}
              boxStyle={!numberError ? styles.mb40 : null}
              value={mobileNumber}
              setValue={handleNumberChange}
              keyboardType={'numeric'}
              maxLength={10}
            />
            {numberError && (
              <Text
                style={[
                  styles.mt8,
                  styles.mb16,
                  styles.ts15,
                  { color: colors.red },
                ]}>
                Please enter a valid mobile number
              </Text>
            )}
            <Button
              label={
                loading ? (
                  <ActivityIndicator size={'small'} color={colors.white} />
                ) : (
                  'Login/Signup'
                )
              }
              style={[styles.mb24, { alignItems: 'center' }]}
              onPress={signInWithPhoneNumber}
              isLoading={loading}
            />
            <Button
              label={'Skip'}
              style={{ backgroundColor: '#F6F2F2', borderWidth: 0.5 }}
              textStyle={{ color: colors.black }}
              onPress={() => {
                logEvent('auth_skipped');
                navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'MainTabs' }] }));
              }}
              disable={loading}
            />
          </View>
          <View
            style={[
              styles.mh12,
              styles.mv8,
              {
                borderRadius: 12,
                backgroundColor: colors.white,
                shadowColor: colors.black,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 4,
                overflow: "hidden"
              },
            ]}
          >
            <BannerAd
              size={BannerAdSize.MEDIUM_RECTANGLE}
              unitId={admobMobilenumberBanner}
              onAdFailedToLoad={error => console.log('Ad failed to load:', error)}
              onAdLoaded={() => console.log('Ad loaded successfully')}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MobileNumber;
