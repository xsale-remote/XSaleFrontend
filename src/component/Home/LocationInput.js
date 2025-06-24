import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Pressable, Image} from 'react-native';
import styles from '../../assets/styles';
import icons from '../../assets/icons';
import colors from '../../assets/colors';
import Geolocation from 'react-native-geolocation-service';

const LocationInput = ({address, onPress}) => {
  const [fullAdddress, setFullAddress] = useState('');

  let filteredAddress =
    address?.length > 65 ? address?.slice(0, 65) + '...' : address;

  if (filteredAddress.includes('India') || filteredAddress.includes('india')) {
    filteredAddress = filteredAddress.replace(/India/gi, '');
  }

  const getLocation = async () => {
    Geolocation.getCurrentPosition(
      position => {
        // decodeLocation(position.coords.latitude, position.coords.longitude);
      },
      error => {
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  getLocation();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.fdRow,
        styles.mt16,
        styles.mb8,
        {
          width: '100%',
          borderRadius: 10,
          shadowColor: colors.black,
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.3,
          shadowRadius: 10,
          backgroundColor: colors.white,
          elevation: 5,
          height: '6%',
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}>
      <View
        style={[
          styles.fdRow,
          {
            width: '88%',
            alignItems: 'center',
            justifyContent: 'center',
          },
          styles.mr4,
        ]}>
        <View>
          <Image
            source={icons.location}
            style={[
              styles.icon20,
              styles.mt4,
              {
                marginRight: 5,
                alignSelf: 'flex-start',
              },
              styles.ml4,
            ]}
          />
        </View>

        <Text
          style={[
            styles.ts16,
            styles.ml4,
            {color: colors.black, width: '90%'},
          ]}>
          {filteredAddress ? filteredAddress : fullAdddress}
        </Text>
      </View>
      <TouchableOpacity>
        <Image source={icons.arrow_next} style={[styles.icon28]} />
      </TouchableOpacity>
    </Pressable>
  );
};
export default LocationInput;
