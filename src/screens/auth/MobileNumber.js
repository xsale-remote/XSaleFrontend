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
// import {BannerAd, TestIds, BannerAdSize} from 'react-native-google-mobile-ads';

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
//           // const inFireBase = response.response[0];
//           const inDatabase = response.response;
//           if (inDatabase) {
//             const url = 'api/v1/user/login';
//             const body = {
//               phoneNumber: mobileNumber,
//               FCMToken: currentFCMToken,
//             };
//             console.log(body, 'body');

//             const {response, status} = await post(url, body);
//             if (status === 200) {
//               const storeUserData = async () => {
//                 try {
//                   const jsonString = JSON.stringify(response.response);
//                   const storedData = await EncryptedStorage.setItem(
//                     'userData',
//                     jsonString,
//                   );
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
//         // else {
//         //   setNumberError(false);
//         //   try {
//         //     const countryCode = '+91';
//         //     const formattedPhoneNumber = `${countryCode} ${mobileNumber}`;
//         //     console.log(formattedPhoneNumber, 'mobile number');
//         //     const confirmation = await auth().signInWithPhoneNumber(
//         //       formattedPhoneNumber,
//         //     );
//         //     if (confirmation) {
//         //       setLoading(false);
//         //       console.log('confirmation', confirmation);

//         //       // here we have to decide that this is new user or existed user

//         //       navigation.replace('OtpScreen', {
//         //         confirmation,
//         //         mobileNumber: mobileNumber,
//         //       });
//         //     } else {
//         //       setLoading(false);
//         //       console.log('cannot get the confirmation object  from firebase');
//         //     }
//         //   } catch (error) {
//         //     setLoading(false);
//         //     console.log('error while getting otp ', error);
//         //     if (error.code === 'auth/too-many-requests') {
//         //       ToastAndroid.showWithGravityAndOffset(
//         //         'Too many OTP requests from the device please try again later',
//         //         ToastAndroid.LONG,
//         //         ToastAndroid.BOTTOM,
//         //         25,
//         //         50,
//         //       );
//         //     } else {
//         //       ToastAndroid.showWithGravityAndOffset(
//         //         'An error occurred while getting OTP. Please try again.',
//         //         ToastAndroid.LONG,
//         //         ToastAndroid.BOTTOM,
//         //         25,
//         //         50,
//         //       );
//         //     }
//         //   }
//         //   setLoading(false);
//         // }
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
//     <SafeAreaView style={[styles.pdh16, {height: '100%'}]}>
//       <View
//         style={[
//           {
//             top: '13%',
//             justifyContent: 'center',
//             alignItems: 'center',
//           },
//         ]}>
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
//       <View style={[{top: '20%'}]}>
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
//           style={styles.mb24}
//           onPress={signInWithPhoneNumber}
//         />
//         <Button
//           label={'Skip'}
//           style={{backgroundColor: '#F6F2F2', borderWidth: 0.5}}
//           textStyle={{color: colors.black}}
//           onPress={() => navigation.navigate('Home')}
//           disable={loading ? true : false}
//         />

//         <View style={{width: '100%', marginTop: 200}}>
//           <View style={{width: '100%', marginTop: 30, borderWidth: 1}}>
//             <BannerAd
//               size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
//               unitId={'ca-app-pub-9372794286829313/4944185351'}
//               onAdFailedToLoad={error => {
//                 console.log('Ad failed to load:', error);
//               }}
//               onAdLoaded={() => {
//                 console.log('Ad loaded successfully');
//               }}
//             />
//           </View>
//         </View>
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
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from '../../assets/styles';
import colors from '../../assets/colors';
import {Button, TitleInput} from '../../component/shared';
import {post} from '../../utils/requestBuilder';
import EncryptedStorage from 'react-native-encrypted-storage';
import messaging from '@react-native-firebase/messaging';
import {BannerAd, TestIds, BannerAdSize} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

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
            console.log(body, 'body');

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
            navigation.navigate('Location', {
              mobileNumber: mobileNumber,
            });
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
      <View style={{flex: 0.3, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={[styles.mb8, {fontSize: 30, color: colors.black}, styles.fwBold]}>
          Welcome !
        </Text>
        <Text
          style={[{fontSize: 18, color: colors.black, textAlign: 'center'}, styles.fwBold]}>
          Let's get started
        </Text>
      </View>
      <View style={{flex: 0.5, justifyContent: 'flex-start', paddingTop: 20}}>
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
            style={[styles.mt8, styles.mb16, styles.ts15, {color: colors.red}]}>
            Please enter a valid mobile number
          </Text>
        )}
        <Button
          label={
            loading ? (
              <ActivityIndicator size={'small'} color={colors.white} style={{alignSelf : "center"}}/>
            ) : (
              'Login/Signup'
            )
          }
          style={styles.mb24}
          onPress={signInWithPhoneNumber}
        />
        <Button
          label={'Skip'}
          style={{backgroundColor: '#F6F2F2', borderWidth: 0.5}}
          textStyle={{color: colors.black}}
          onPress={() => navigation.navigate('Home')}
          disable={loading ? true : false}
        />
      </View>
      <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
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
    </SafeAreaView>
  );
};

export default MobileNumber;