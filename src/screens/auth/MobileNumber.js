// import {
//   View,
//   Text,
//   SafeAreaView,
//   ActivityIndicator,
//   ToastAndroid,
//   Image,
// } from 'react-native';
// import React, {useEffect, useState} from 'react';
// import styles from '../../assets/styles';
// import colors from '../../assets/colors';
// import {Button, TitleInput} from '../../component/shared';
// import {post} from '../../utils/requestBuilder';
// import EncryptedStorage from 'react-native-encrypted-storage';
// import messaging from '@react-native-firebase/messaging';
// import {
//   BannerAd,
//   TestIds,
//   BannerAdSize,
//   InterstitialAd,
//   AdEventType,
// } from 'react-native-google-mobile-ads';

// const adUnitId = __DEV__
//   ? TestIds.ADAPTIVE_BANNER
//   : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

// const MobileNumber = ({navigation, route}) => {
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [numberError, setNumberError] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [currentFCMToken, setCurrentFCMToken] = useState('');

//   const getToken = async () => {
//     try {
//       const token = await messaging().getToken();
//       setCurrentFCMToken(token);
//     } catch (error) {
//       console.log(`error while getting token ${error}`);
//     }
//   };

//   useEffect(() => {
//     getToken();
//   }, []);

//   const signInWithPhoneNumber = async () => {
//     setLoading(true);
//     if (mobileNumber.length !== 10) {
//       setLoading(false);
//       setNumberError(true);
//     } else {

//       setNumberError(false);
//       const body = {
//         phoneNumber: `+91${mobileNumber}`,
//       };
//       try {
//         const url = 'api/v1/user/check-user';
//         const {response, status} = await post(url, body);
//         if (response.response !== null) {
//           const inDatabase = response.response;
//           if (inDatabase) {
//             const url = 'api/v1/user/login';
//             const body = {
//               phoneNumber: mobileNumber,
//               FCMToken: currentFCMToken,
//             };
//             const interstitialAdUnitId =
//               'ca-app-pub-9372794286829313/4227844649';
//             const interstitial =
//               InterstitialAd.createForAdRequest(interstitialAdUnitId);

//             // Load the interstitial ad
//             interstitial.load();

//             // Show the ad once loaded
//             const unsubscribeLoad = interstitial.addAdEventListener(
//               AdEventType.LOADED,
//               () => {
//                 interstitial.show();
//               },
//             );

//             // Navigate after ad is closed
//             const unsubscribeClose = interstitial.addAdEventListener(
//               AdEventType.CLOSED,
//               () => {
//                 unsubscribeLoad();
//                 unsubscribeClose();
//                 unsubscribeError();
//                 navigation.navigate('Home');
//               },
//             );

//             // Navigate if ad loading/showing errors out
//             const unsubscribeError = interstitial.addAdEventListener(
//               AdEventType.ERROR,
//               () => {
//                 unsubscribeLoad();
//                 unsubscribeClose();
//                 unsubscribeError();
//                 navigation.navigate('Home');
//               },
//             );

//             const {response, status} = await post(url, body);
//             if (status === 200) {
//               const storeUserData = async () => {
//                 try {
//                   const jsonString = JSON.stringify(response.response);
//                   await EncryptedStorage.setItem('userData', jsonString);
//                 } catch (error) {
//                   console.log(
//                     `error while storing user data to encrypted storage ${error}`,
//                   );
//                 }
//               };
//               storeUserData();
//               ToastAndroid.showWithGravityAndOffset(
//                 'Login Successfully',
//                 ToastAndroid.LONG,
//                 ToastAndroid.BOTTOM,
//                 25,
//                 50,
//               );
//               setLoading(false);
//               navigation.replace('Home');
//             } else {
//               ToastAndroid.showWithGravityAndOffset(
//                 'An error occurred while login you in',
//                 ToastAndroid.LONG,
//                 ToastAndroid.BOTTOM,
//                 25,
//                 50,
//               );
//               setLoading(false);
//             }
//           }
//         } else {
//           try {
//             setNumberError(false);
//             setLoading(false);
//             navigation.navigate('Location', {
//               mobileNumber: mobileNumber,
//             });
//           } catch (error) {
//             console.log('errow while registering the user ', error);
//           }
//         }
//       } catch (error) {
//         console.log('error while login/signup ', error);
//         setLoading(false);
//       }
//     }
//   };

//   function filterInput(input) {
//     const sanitizedInput = input.replace(/\D/g, '');
//     return sanitizedInput;
//   }

//   const handleNumberChange = t => {
//     const filteredInput = filterInput(t);
//     setMobileNumber(filteredInput);
//   };

//   return (
//     <SafeAreaView style={[styles.pdh16, {flex: 1}]}>
//       <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}>
//         <Text
//           style={[
//             styles.mb8,
//             {fontSize: 30, color: colors.black},
//             styles.fwBold,
//           ]}>
//           Welcome !
//         </Text>
//         <Text
//           style={[
//             {fontSize: 18, color: colors.black, textAlign: 'center'},
//             styles.fwBold,
//           ]}>
//           Let's get started
//         </Text>
//       </View>
//       <View style={[{flex: 0.5, justifyContent: 'flex-start'}]}>
//         <TitleInput
//           inputPlaceholder={'Enter here'}
//           title={'Mobile Number'}
//           boxStyle={!numberError ? styles.mb40 : null}
//           value={mobileNumber}
//           setValue={handleNumberChange}
//           keyboardType={'numeric'}
//           maxLength={10}
//         />
//         {numberError && (
//           <Text
//             style={[styles.mt8, styles.mb16, styles.ts15, {color: colors.red}]}>
//             Please enter a valid mobile number
//           </Text>
//         )}
//         <Button
//           label={
//             loading ? (
//               <ActivityIndicator size={'small'} color={colors.white} />
//             ) : (
//               'Login/Signup'
//             )
//           }
//           style={[styles.mb24, {alignItems: 'center'}]}
//           onPress={signInWithPhoneNumber}
//           isLoading={loading}
//         />
//         <Button
//           label={'Skip'}
//           style={{backgroundColor: '#F6F2F2', borderWidth: 0.5}}
//           textStyle={{color: colors.black}}
//           onPress={() => {
//             const interstitialAdUnitId =
//               'ca-app-pub-9372794286829313/4227844649';
//             const interstitial =
//               InterstitialAd.createForAdRequest(interstitialAdUnitId);

//             // Load the interstitial ad
//             interstitial.load();

//             // Show the ad once loaded
//             const unsubscribeLoad = interstitial.addAdEventListener(
//               AdEventType.LOADED,
//               () => {
//                 interstitial.show();
//               },
//             );

//             // Navigate after ad is closed
//             const unsubscribeClose = interstitial.addAdEventListener(
//               AdEventType.CLOSED,
//               () => {
//                 unsubscribeLoad();
//                 unsubscribeClose();
//                 unsubscribeError();
//                 navigation.navigate('Home');
//               },
//             );

//             // Navigate if ad loading/showing errors out
//             const unsubscribeError = interstitial.addAdEventListener(
//               AdEventType.ERROR,
//               () => {
//                 unsubscribeLoad();
//                 unsubscribeClose();
//                 unsubscribeError();
//                 navigation.navigate('Home');
//               },
//             );
//           }}
//           disable={loading ? true : false}
//         />
//       </View>
//       <View style={[{position : "absolute" , bottom : 20}]}>
//         <BannerAd
//           size={BannerAdSize.INLINE_ADAPTIVE_BANNER}
//           unitId={'ca-app-pub-9372794286829313/4639295228'}
//           onAdFailedToLoad={error => {
//             console.log('Ad failed to load:', error);
//           }}
//           onAdLoaded={() => {
//             console.log('Ad loaded successfully');
//           }}
//         />
//       </View>
//       <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
//         <BannerAd
//           size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
//           unitId={'ca-app-pub-9372794286829313/4944185351'}
//           onAdFailedToLoad={error => {
//             console.log('Ad failed to load:', error);
//           }}
//           onAdLoaded={() => {
//             console.log('Ad loaded successfully');
//           }}
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// export default MobileNumber;

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
    const interstitialAdUnitId = 'ca-app-pub-9372794286829313/4227844649';
    const interstitial =
      InterstitialAd.createForAdRequest(interstitialAdUnitId);
    setLoading(true);
    if (mobileNumber.length !== 10) {
      setLoading(false);
      setNumberError(true);
    } else {
      setNumberError(false);
      const body = {
        phoneNumber: `+91${mobileNumber}`,
      };
      try {
        const url = 'api/v1/user/check-user';
        const {response, status} = await post(url, body);
        if (response.response !== null) {
          const inDatabase = response.response;
          if (inDatabase) {
            const url = 'api/v1/user/login';
            const body = {
              phoneNumber: mobileNumber,
              FCMToken: currentFCMToken,
            };
            // Load the interstitial ad
            interstitial.load();

            // Show the ad once loaded
            const unsubscribeLoad = interstitial.addAdEventListener(
              AdEventType.LOADED,
              () => {
                interstitial.show();
              },
            );

            // Navigate after ad is closed
            const unsubscribeClose = interstitial.addAdEventListener(
              AdEventType.CLOSED,
              () => {
                unsubscribeLoad();
                unsubscribeClose();
                unsubscribeError();
                navigation.navigate('Home');
              },
            );

            // Navigate if ad loading/showing errors out
            const unsubscribeError = interstitial.addAdEventListener(
              AdEventType.ERROR,
              () => {
                unsubscribeLoad();
                unsubscribeClose();
                unsubscribeError();
                navigation.navigate('Home');
              },
            );

            const {response, status} = await post(url, body);
            if (status === 200) {
              const storeUserData = async () => {
                try {
                  const jsonString = JSON.stringify(response.response);
                  await EncryptedStorage.setItem('userData', jsonString);
                } catch (error) {
                  console.log(
                    `error while storing user data to encrypted storage ${error}`,
                  );
                }
              };
              storeUserData();
              ToastAndroid.showWithGravityAndOffset(
                'Login Successfully',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50,
              );
              setLoading(false);
              navigation.replace('Home');
            } else {
              ToastAndroid.showWithGravityAndOffset(
                'An error occurred while login you in',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50,
              );
              setLoading(false);
            }
          }
        } else {
          try {
            setNumberError(false);
            setLoading(false);
            interstitial.load();

            // Show the ad once loaded
            const unsubscribeLoad = interstitial.addAdEventListener(
              AdEventType.LOADED,
              () => {
                interstitial.show();
              },
            );

            // Navigate after ad is closed
            const unsubscribeClose = interstitial.addAdEventListener(
              AdEventType.CLOSED,
              () => {
                unsubscribeLoad();
                unsubscribeClose();
                unsubscribeError();
                navigation.navigate('Location', {
                  mobileNumber: mobileNumber,
                });
              },
            );

            // Navigate if ad loading/showing errors out
            const unsubscribeError = interstitial.addAdEventListener(
              AdEventType.ERROR,
              () => {
                unsubscribeLoad();
                unsubscribeClose();
                unsubscribeError();
                navigation.navigate('Location', {
                  mobileNumber: mobileNumber,
                });
              },
            );
            // navigation.navigate('Location', {
            //   mobileNumber: mobileNumber,
            // });
          } catch (error) {
            console.log('errow while registering the user ', error);
          }
        }
      } catch (error) {
        console.log('error while login/signup ', error);
        setLoading(false);
      }
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
                const interstitialAdUnitId =
                  'ca-app-pub-9372794286829313/4227844649';
                const interstitial =
                  InterstitialAd.createForAdRequest(interstitialAdUnitId);

                // Load the interstitial ad
                interstitial.load();

                // Show the ad once loaded
                const unsubscribeLoad = interstitial.addAdEventListener(
                  AdEventType.LOADED,
                  () => {
                    interstitial.show();
                  },
                );

                // Navigate after ad is closed
                const unsubscribeClose = interstitial.addAdEventListener(
                  AdEventType.CLOSED,
                  () => {
                    unsubscribeLoad();
                    unsubscribeClose();
                    unsubscribeError();
                    navigation.navigate('Home');
                  },
                );

                // Navigate if ad loading/showing errors out
                const unsubscribeError = interstitial.addAdEventListener(
                  AdEventType.ERROR,
                  () => {
                    unsubscribeLoad();
                    unsubscribeClose();
                    unsubscribeError();
                    navigation.navigate('Home');
                  },
                );
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
