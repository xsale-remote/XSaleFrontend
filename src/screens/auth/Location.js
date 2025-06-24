// import {
//   SafeAreaView,
//   View,
//   Text,
//   Image,
//   PermissionsAndroid,
//   Linking,
// } from 'react-native';
// import React, {useEffect, useState} from 'react';
// import {ButtonWithIcon} from '../../component/shared';
// import icons from '../../assets/icons';
// import styles from '../../assets/styles';
// import colors from '../../assets/colors';
// import Geolocation from 'react-native-geolocation-service';
// import axios from 'axios';
// import {GOOGLE_MAP_KEY} from '../../utils/env';
// import {BannerAd, TestIds, BannerAdSize} from 'react-native-google-mobile-ads';

// const Location = ({navigation, route}) => {
//   const {mobileNumber} = route.params;
//   const [locationLoading, setLocationLoading] = useState(false);
//   const [fullAddress, setFullAddress] = useState('');
//   const [receivedMobileNumber, setReceivedMobileNumber] = useState('');
//   const [addressInfo, setAddressInfo] = useState({
//     city: '',
//     state: '',
//     pincode: '',
//     country: '',
//     latitude: '',
//     longitude: '',
//   });

//   useEffect(() => {
//     requestLocationPermission();
//     setReceivedMobileNumber(mobileNumber);
//   }, []);

//   const getLocation = async () => {
//     setLocationLoading(true);
//     Geolocation.getCurrentPosition(
//       position => {
//         setLocationLoading(false);
//         decodeLocation(position.coords.latitude, position.coords.longitude);
//       },
//       error => {
//         setLocationLoading(false);
//         console.log(error.code, error.message);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 10000,
//       },
//     );
//   };

//   const findLocation = async () => {
//     try {
//       const granted = await PermissionsAndroid.check(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       );

//       if (!granted) {
//         const rationale = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Location Permission',
//             message: 'We need your location to provide better services.',
//             buttonPositive: 'OK',
//             buttonNegative: 'Cancel',
//           },
//         );

//         if (rationale === PermissionsAndroid.RESULTS.GRANTED) {
//           getLocation();
//         } else if (rationale === PermissionsAndroid.RESULTS.DENIED) {
//           console.log('Location permission denied');
//         } else if (rationale === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
//           console.log('Permission permanently denied, navigate to settings');
//           openAppSettings();
//         }
//       } else {
//         getLocation();
//       }
//     } catch (error) {
//       console.log('Error while fetching user location', error);
//     }
//   };

//   const openAppSettings = () => {
//     Linking.openSettings().catch(() => {
//       console.log('Unable to open app settings');
//     });
//   };

//   const requestLocationPermission = async () => {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         {
//           title: 'Location Permission',
//           message:
//             'This app needs access to your location ' +
//             'so we can provide better services.',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         },
//       );

//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         console.log('Location permission granted');
//         return true;
//       } else {
//         console.log('Location permission denied');
//         return false;
//       }
//     } catch (err) {
//       console.warn(err);
//       return false;
//     }
//   };

//   const decodeLocation = async (latitude, longitude) => {
//     try {
//       const response = await axios.get(
//         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAP_KEY}`,
//       );
//       if (response.status === 200) {
//         const results = response.data.results;
//         if (results.length === 0) {
//           console.error('No results found for the given coordinates.');
//           return;
//         }
//         const {formatted_address, address_components} = results[0];

//         if (!formatted_address || !address_components) {
//           console.error('Required fields missing in the response:', results[0]);
//           return;
//         }

//         const city = address_components.find(component =>
//           component.types.includes('locality'),
//         );
//         const state = address_components.find(component =>
//           component.types.includes('administrative_area_level_1'),
//         );
//         const pincode = address_components.find(component =>
//           component.types.includes('postal_code'),
//         );
//         const country = address_components.find(component =>
//           component.types.includes('country'),
//         );

//         const location = results[0].geometry.location;
//         const lat = location?.lat;
//         const lng = location?.lng;

//         setFullAddress(formatted_address);
//         const updatedAddressInfo = {
//           city: city?.long_name || '',
//           state: state?.long_name || '',
//           pincode: pincode?.long_name || '',
//           country: country?.long_name || '',
//           latitude: lat,
//           longitude: lng,
//         };
//         setAddressInfo(updatedAddressInfo);
//         navigation.navigate('NameScreen', {
//           fullAddress: formatted_address,
//           addressInfo: updatedAddressInfo,
//           receivedMobileNumber,
//         });
//       } else {
//         console.error('Error fetching address details:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error decoding location:', error);
//       if (error.response) {
//         console.error('Error Response Data:', error.response.data);
//         console.error('Error Response Status:', error.response.status);
//         console.error('Error Response Headers:', error.response.headers);
//       }
//     }
//   };

//   return (
//     <SafeAreaView
//       style={[
//         {height: '100%', justifyContent: 'center', alignItems: 'center'},
//         styles.pdh16,
//       ]}>
//       <Image
//         source={icons.locationMap}
//         style={[{width: 250, height: 220, resizeMode: 'contain'}, styles.mb48]}
//       />
//       <Text style={[{color: '#A59C9C'}, styles.ts15, styles.mb4]}>
//         Enjoy a personalized selling and buying experience by telling us your
//         location
//       </Text>
//       <ButtonWithIcon
//         style={styles.mt20}
//         icon={icons.location}
//         label={'Find My Location'}
//         onPress={findLocation}
//         isLoading={locationLoading}
//       />
//       <Text
//         style={[{color: colors.black}, styles.ts16, styles.mt36]}
//         onPress={() =>
//           navigation.navigate('ChooseLocation', {
//             purpose: 'creating new user',
//             receivedMobileNumber,
//           })
//         }>
//         Other Location
//       </Text>

//       <View style={{width: '100%', borderWidth: 1}}>
//         <BannerAd
//           size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
//           unitId={'ca-app-pub-9372794286829313/8312337303'}
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

// export default Location;










import {
  SafeAreaView,
  View,
  Text,
  Image,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ButtonWithIcon} from '../../component/shared';
import icons from '../../assets/icons';
import styles from '../../assets/styles';
import colors from '../../assets/colors';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import {GOOGLE_MAP_KEY} from '../../utils/env';
import {BannerAd, TestIds, BannerAdSize} from 'react-native-google-mobile-ads';

const Location = ({navigation, route}) => {
  const {mobileNumber} = route.params;
  const [locationLoading, setLocationLoading] = useState(false);
  const [fullAddress, setFullAddress] = useState('');
  const [receivedMobileNumber, setReceivedMobileNumber] = useState('');
  const [addressInfo, setAddressInfo] = useState({
    city: '',
    state: '',
    pincode: '',
    country: '',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    requestLocationPermission();
    setReceivedMobileNumber(mobileNumber);
  }, []);

  const getLocation = async () => {
    setLocationLoading(true);
    Geolocation.getCurrentPosition(
      position => {
        setLocationLoading(false);
        decodeLocation(position.coords.latitude, position.coords.longitude);
      },
      error => {
        setLocationLoading(false);
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  const findLocation = async () => {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (!granted) {
        const rationale = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'We need your location to provide better services.',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          },
        );

        if (rationale === PermissionsAndroid.RESULTS.GRANTED) {
          getLocation();
        } else if (rationale === PermissionsAndroid.RESULTS.DENIED) {
          console.log('Location permission denied');
        } else if (rationale === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          console.log('Permission permanently denied, navigate to settings');
          openAppSettings();
        }
      } else {
        getLocation();
      }
    } catch (error) {
      console.log('Error while fetching user location', error);
    }
  };

  const openAppSettings = () => {
    Linking.openSettings().catch(() => {
      console.log('Unable to open app settings');
    });
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This app needs access to your location ' +
            'so we can provide better services.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
        return true;
      } else {
        console.log('Location permission denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const decodeLocation = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAP_KEY}`,
      );
      if (response.status === 200) {
        const results = response.data.results;
        if (results.length === 0) {
          console.error('No results found for the given coordinates.');
          return;
        }
        const {formatted_address, address_components} = results[0];

        if (!formatted_address || !address_components) {
          console.error('Required fields missing in the response:', results[0]);
          return;
        }

        const city = address_components.find(component =>
          component.types.includes('locality'),
        );
        const state = address_components.find(component =>
          component.types.includes('administrative_area_level_1'),
        );
        const pincode = address_components.find(component =>
          component.types.includes('postal_code'),
        );
        const country = address_components.find(component =>
          component.types.includes('country'),
        );

        const location = results[0].geometry.location;
        const lat = location?.lat;
        const lng = location?.lng;

        setFullAddress(formatted_address);
        const updatedAddressInfo = {
          city: city?.long_name || '',
          state: state?.long_name || '',
          pincode: pincode?.long_name || '',
          country: country?.long_name || '',
          latitude: lat,
          longitude: lng,
        };
        setAddressInfo(updatedAddressInfo);
        navigation.navigate('NameScreen', {
          fullAddress: formatted_address,
          addressInfo: updatedAddressInfo,
          receivedMobileNumber,
        });
      } else {
        console.error('Error fetching address details:', response.statusText);
      }
    } catch (error) {
      console.error('Error decoding location:', error);
      if (error.response) {
        console.error('Error Response Data:', error.response.data);
        console.error('Error Response Status:', error.response.status);
        console.error('Error Response Headers:', error.response.headers);
      }
    }
  };

  return (
    <SafeAreaView style={[{flex: 1}, styles.pdh16]}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={icons.locationMap}
          style={[{width: 250, height: 220, resizeMode: 'contain'}, styles.mb48]}
        />
        <Text style={[{color: '#A59C9C'}, styles.ts15, styles.mb4]}>
          Enjoy a personalized selling and buying experience by telling us your
          location
        </Text>
        <ButtonWithIcon
          style={styles.mt20}
          icon={icons.location}
          label={'Find My Location'}
          onPress={findLocation}
          isLoading={locationLoading}
        />
        <Text
          style={[{color: colors.black}, styles.ts16, styles.mt36]}
          onPress={() =>
            navigation.navigate('ChooseLocation', {
              purpose: 'creating new user',
              receivedMobileNumber,
            })
          }>
          Other Location
        </Text>
      </View>
      <View style={{width: '100%', borderWidth:1}}>
        <BannerAd
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          unitId={'ca-app-pub-9372794286829313/8312337303'}
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

export default Location;