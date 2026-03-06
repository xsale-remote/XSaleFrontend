import {
  View,
  Text,
  SafeAreaView,
  Image,
  Pressable,
  Animated,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {TitleHeader, Button, ButtonText} from '../../component/shared';
import styles from '../../assets/styles';
import colors from '../../assets/colors';
import icons from '../../assets/icons';
import {GOOGLE_MAP_KEY} from '../../utils/env';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {put} from '../../utils/requestBuilder';
import {getUserInfo} from '../../utils/function';
import EncryptedStorage from 'react-native-encrypted-storage';

const ChangeLocation = ({navigation, route}) => {
  const {address} = route.params;
  const [selectedOption, setSelectedOption] = useState('Current Location');
  const [fullAddress, setFullAddress] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState();
  const [userLocationId, setUserLocationId] = useState('');
  const [showButton, setShowButton] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const userData = await getUserInfo();
      if (userData) {
        setIsLoggedIn(true);
        const userId = userData?.user?._id;
        const locationId = userData?.user?.location._id;
        setUserLocationId(locationId);
        setUserId(userId);
      } else if (!userData) {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.log(`errow while fetching user data ${error}`);
    }
  };

  const handlePlacePress = async (data, details) => {
    if (data) {
      const {description, place_id} = data;
      setFullAddress(description);
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${GOOGLE_MAP_KEY}`,
        );
        const placeDetails = await response.json();
        if (placeDetails.status === 'OK') {
          const {lat, lng} = placeDetails.result.geometry.location;
          const addressComponents = placeDetails.result.address_components;

          const cityComponent = addressComponents.find(component =>
            component.types.includes('locality'),
          );
          const stateComponent = addressComponents.find(component =>
            component.types.includes('administrative_area_level_1'),
          );

          const pincodeComponent = addressComponents.find(component =>
            component.types.includes('postal_code'),
          );
          const countryComponent = addressComponents.find(component =>
            component.types.includes('country'),
          );

          const updatedAddressInfo = {
            city: cityComponent?.long_name || '',
            state: stateComponent?.long_name || '',
            pincode: pincodeComponent?.long_name || '',
            country: countryComponent?.long_name || '',
            latitude: lat,
            longitude: lng,
            fullAddress: description,
          };
          setUserLocation(updatedAddressInfo);
          setShowButton(true);
        } else {
          console.error('Error fetching place details:', placeDetails.status);
        }
      } catch (error) {
        console.error('Error fetching place details:', error);
      }
    } else {
      console.error('Error while setting location', data);
    }
  };

  const showAutocomplete = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true, 
    }).start();
  };

  const updateUserLocation = async () => {
    setLoading(true);
    try {
      if (!isLoggedIn) {
        ToastAndroid.showWithGravityAndOffset(
          'Please login to update your location',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      } else {
        const body = {
          userId,
          locationDetails: userLocation,
          locationObjectId: userLocationId,
        };
        const url = `api/v1/user/update/user/location`;
        const {response, status} = await put(url, body, true);
        if (status === 200) {
          try {
            const jsonString = JSON.stringify(response.response);
            await EncryptedStorage.setItem('userData', jsonString);
            ToastAndroid.showWithGravityAndOffset(
              'Location update Successful',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
            navigation.pop();
          } catch (error) {
            console.log(
              `Error while saving the updated user data in storage: ${error}`,
            );
          }
        } else {
          console.log('Status is not 200 while updating location', status);
        }
      }
    } catch (error) {
      console.log(`error while updating user location ${error}`);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.pdh16, {flex: 1}]}>
      <TitleHeader
        title={`Location`}
        onBackPress={() => {
          loading ? null : navigation.pop();
        }}
      />
      <View
        style={[
          {width: '110%', borderWidth: 1, alignSelf: 'center', opacity: 0.2},
        ]}></View>
      <View style={[styles.pdt12, {flex: 1}]}>
        <Text style={[styles.h2, styles.mb16, {color: colors.black}]}>
          Location
        </Text>
        <View
          style={[
            styles.p12,
            {width: '100%', borderWidth: 0.5, borderRadius: 7},
          ]}>
          <Text style={[styles.ts15, {color: colors.darkGrey}, styles.fw700]}>
            {address}
          </Text>
        </View>
        <View style={[styles.mt16]}>
          <Pressable
            style={[styles.fdRow]}
            onPress={() => {
              setSelectedOption('Manual Location');
              showAutocomplete();
            }}>
            <Image
              source={icons.location}
              style={[
                styles.icon24,
                {
                  tintColor:
                    selectedOption === 'Manual Location'
                      ? colors.mintGreen
                      : null,
                },
              ]}
            />
            <Text
              style={[
                {
                  color:
                    selectedOption === 'Manual Location'
                      ? colors.mintGreen
                      : colors.grey500,
                },
                styles.ts18,
                styles.ml12,
              ]}>
              Enter Manual Location
            </Text>
          </Pressable>
        </View>
        {selectedOption === 'Manual Location' && (
          <Animated.View style={[{opacity: fadeAnim}, styles.mt16]}>
            <GooglePlacesAutocomplete
              placeholder="Enter Location"
              fetchDetails={true}
              onPress={handlePlacePress}
              query={{
                key: GOOGLE_MAP_KEY,
                language: 'en',
                components: 'country:in', 
              }}
              styles={{
                textInput: {
                  fontSize: 15,
                  color: colors.grey500, 
                },
                container: {flex: 0},
                listView: {backgroundColor: 'white'}, 
                description: {
                  color: colors.grey800,
                },
              }}
              debounce={500}
              textInputProps={{
                placeholderTextColor: colors.grey500, 
              }}
            />
          </Animated.View>
        )}

        <View style={[{position: 'absolute', bottom: 20, alignSelf: 'center'}]}>
          {showButton && (
            <Button
              label={
                loading ? (
                  <ActivityIndicator size={'small'} color={colors.white} />
                ) : (
                  'Update Location'
                )
              }
              onPress={updateUserLocation}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChangeLocation;
