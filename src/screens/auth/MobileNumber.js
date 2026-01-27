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
import React, {useEffect, useState} from 'react';
import styles from '../../assets/styles';
import colors from '../../assets/colors';
import {Button, TitleInput} from '../../component/shared';
import {post} from '../../utils/requestBuilder';
import EncryptedStorage from 'react-native-encrypted-storage';
import messaging from '@react-native-firebase/messaging';
import {
  BannerAd,
  TestIds,
  BannerAdSize,
  InterstitialAd,
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';

const MobileNumber = ({navigation, route}) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [numberError, setNumberError] = useState(false);
  const [loading, setLoading] = useState(false);
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
    getToken();
  }, []);

  const signInWithPhoneNumber = async () => {
    if (mobileNumber.length !== 10) {
      setNumberError(true);
      return;
    }

    setNumberError(false);
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 50));

    const rewardedAdUnitId = 'ca-app-pub-9372794286829313/1559464025';
    const rewarded = RewardedAd.createForAdRequest(rewardedAdUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    let navigationHandled = false;
    const safeNavigate = (screen, params = {}) => {
      if (!navigationHandled) {
        navigationHandled = true;
        navigation.navigate(screen, params);
      }
    };

    const showRewardedAd = onComplete => {
      let timeout;
      const unsubscribe = rewarded.addAdEventsListener(async ({type}) => {
        if (type === RewardedAdEventType.LOADED) {
          rewarded.show();
        }

        if (type === RewardedAdEventType.EARNED_REWARD) {
          clearTimeout(timeout);
          unsubscribe();
          onComplete();
        }

        if (
          type === RewardedAdEventType.ERROR ||
          type === RewardedAdEventType.CLOSED
        ) {
          clearTimeout(timeout);
          unsubscribe();
          onComplete();
        }
      });

      rewarded.load();
      timeout = setTimeout(() => {
        console.log('⚠️ Ad timeout, proceeding without ad...');
        unsubscribe();
        onComplete();
      }, 6000);
    };

    try {
      const url = 'api/v1/user/check-user';
      const {response, status} = await post(url, {
        phoneNumber: `+91${mobileNumber}`,
      });

      const userExists = response?.response?._id;
      if (userExists) {
        const loginUrl = 'api/v1/user/login';
        const loginBody = {
          phoneNumber: mobileNumber,
          FCMToken: currentFCMToken,
        };

        const {response: loginResponse, status} = await post(
          loginUrl,
          loginBody,
        );
        if (status === 200) {
          await EncryptedStorage.setItem(
            'userData',
            JSON.stringify(loginResponse.response),
          );

          ToastAndroid.showWithGravityAndOffset(
            'Login Successfully',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );

          showRewardedAd(() => {
            safeNavigate('Home');
            setLoading(false);
          });
        } else {
          ToastAndroid.show(
            'Login failed, please try again',
            ToastAndroid.SHORT,
          );
          setLoading(false);
        }
      } else {
        showRewardedAd(() => {
          safeNavigate('Location', {mobileNumber});
          setLoading(false);
        });
      }
    } catch (error) {
      console.log('Error during login/signup:', error);
      ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      setLoading(false);
      safeNavigate('Home');
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
    <SafeAreaView style={[styles.pdh16, {flex: 1}]}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}
          keyboardShouldPersistTaps="handled">
          <View
            style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={[
                styles.mb8,
                {fontSize: 30, color: colors.black},
                styles.fwBold,
              ]}>
              Welcome !
            </Text>
            <Text
              style={[
                {fontSize: 18, color: colors.black, textAlign: 'center'},
                styles.fwBold,
              ]}>
              Let's get started
            </Text>
          </View>
          <View style={{flex: 0.5, justifyContent: 'flex-start'}}>
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
                  {color: colors.red},
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
              style={[styles.mb24, {alignItems: 'center'}]}
              onPress={signInWithPhoneNumber}
              isLoading={loading}
            />
            <Button
              label={'Skip'}
              style={{backgroundColor: '#F6F2F2', borderWidth: 0.5}}
              textStyle={{color: colors.black}}
              onPress={() => {
                const rewardedAdUnitId =
                  'ca-app-pub-9372794286829313/1559464025';
                const rewarded = RewardedAd.createForAdRequest(
                  rewardedAdUnitId,
                  {
                    requestNonPersonalizedAdsOnly: true,
                  },
                );
                const unsubscribe = rewarded.addAdEventsListener(
                  async ({type}) => {
                    // When ad is loaded, show it
                    if (type === RewardedAdEventType.LOADED) {
                      rewarded.show();
                    }

                    // When user earns the reward (ad completed)
                    if (type === RewardedAdEventType.EARNED_REWARD) {
                      unsubscribe();
                      navigation.navigate('Home');
                    }

                    // When ad fails to load or is closed early — still navigate
                    if (
                      type === RewardedAdEventType.ERROR ||
                      type === RewardedAdEventType.CLOSED
                    ) {
                      unsubscribe();
                      navigation.navigate('Home');
                    }
                  },
                );

                // Start loading the ad
                rewarded.load();
                navigation.navigate('Home');
              }}
              disable={loading}
            />
          </View>
          <View>
            <BannerAd
              size={BannerAdSize.INLINE_ADAPTIVE_BANNER}
              unitId={'ca-app-pub-9372794286829313/4639295228'}
              onAdFailedToLoad={error => {
                console.log('Ad failed to load:', error);
              }}
              onAdLoaded={() => {
                console.log('Ad loaded successfully');
              }}
            />
            <View></View>
            <BannerAd
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              unitId={'ca-app-pub-9372794286829313/4944185351'}
              onAdFailedToLoad={error => {
                console.log('Ad failed to load:', error);
              }}
              onAdLoaded={() => {
                console.log('Ad loaded successfully');
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MobileNumber;
