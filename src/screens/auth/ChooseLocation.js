import React, {useState} from 'react';
import {View, SafeAreaView, StyleSheet,  Alert} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Button, TitleHeader} from '../../component/shared';
import MapView, {Marker} from 'react-native-maps';
import styles from '../../assets/styles';
import {GOOGLE_MAP_KEY} from '../../utils/env';
import colors from '../../assets/colors';


const ChooseLocation = ({navigation, route}) => {
  const {purpose, receivedMobileNumber} = route.params;
  const itemDetailsUser = route.params;
  const indiaLatitude = 20.5937;
  const indiaLongitude = 78.9629;
  const initialRegion = {
    latitude: indiaLatitude,
    longitude: indiaLongitude,
    latitudeDelta: 20,
    longitudeDelta: 20,
  };
  const [fullAddress, setFullAddress] = useState('');
  const [region, setRegion] = useState(initialRegion);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [addressInfo, setAddressInfo] = useState('');
  const [placeId, setPlaceId] = useState('');

  const handlePlacePress = async (data, details) => {
    if (data) {
      const {description, place_id} = data;
      setFullAddress(description);
      setPlaceId(place_id);
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
          };

          setRegion({
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
          });
          setMarkerPosition({latitude: lat, longitude: lng});
          setAddressInfo(updatedAddressInfo);
          setFullAddress(description);

          if (purpose === 'creating new user') {
            // Navigate after state is set
            navigation.navigate('NameScreen', {
              fullAddress: description,
              addressInfo: updatedAddressInfo,
              receivedMobileNumber,
            });
          } else if (purpose === 'creating new item') {
            const itemDetailsUserAddress = {
              ...itemDetailsUser,
              fullAddress: description,
              itemLatitude : lat , itemLongitude : lng
            };
            navigation.navigate('ViewAd', itemDetailsUserAddress);
          }
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

  const handleDonePress = () => {
    if (!fullAddress) {
      Alert.alert(
        'Please Select Address',
        "You haven't chosen a location yet. Please select an address before proceeding.",
        [{text: 'OK', onPress: () => console.log('Alert dismissed')}],
      );
    } else {
      if (route.params.purpose === 'creating new user') {
        navigation.navigate('NameScreen', {
          fullAddress,
          addressInfo,
          receivedMobileNumber,
        });
      } else if (route.params.purpose === 'creating new item') {
        const itemDetailsUserAddress = {
          ...itemDetailsUser,
          fullAddress: fullAddress,
          itemLatitude : addressInfo.latitude , 
          itemLongitude : addressInfo.longitude
        };
        navigation.navigate('ViewAd', itemDetailsUserAddress);
      }
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={[styles.pdh16]}>
        <TitleHeader
          title={'Choose Location'}
          onBackPress={() => navigation.pop()}
        />
      </View>
      <View style={[{flex: 1}]}>
        <MapView style={StyleSheet.absoluteFill} region={region}>
          {markerPosition && <Marker coordinate={markerPosition} />}
        </MapView>
        <View style={[stylesObject.searchContainer]}>
          <GooglePlacesAutocomplete
            placeholder="Enter Location"
            onPress={handlePlacePress}
            debounce={500}
            minLength={3}
            query={{
              key: GOOGLE_MAP_KEY,
              language: 'en',
              components: 'country:in',
            }}
            styles={{
              textInput: {
                fontSize: 15,
                color: colors.grey500,
                placeholderTextColor: colors.grey500,
              },
              listView: {
                backgroundColor: colors.background,
              },
              description: {
                color: colors.grey500, 
              },
            }}
            textInputProps={{
              placeholderTextColor: colors.grey500,
            }}
          />
        </View>
        <Button
          label={'Done'}
          style={[
            {position: 'absolute', alignSelf: 'center', bottom: 30, width: 100},
          ]}
          textStyle={[styles.ts18, styles.fw700]}
          onPress={handleDonePress}
        />
      </View>
    </SafeAreaView>
  );
};

const stylesObject = StyleSheet.create({
  pdh16: {
    paddingHorizontal: 16,
  },
  searchContainer: {
    position: 'absolute',
    top: 20,
    left: 16,
    right: 16,
    zIndex: 1,
  },
});

export default ChooseLocation;
