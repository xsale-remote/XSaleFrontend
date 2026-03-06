import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import colors from '../../assets/colors';
import styles from '../../assets/styles';
import icons from '../../assets/icons';
import images from '../../assets/images';
import { useNavigation } from '@react-navigation/native';

const HomeHeader = ({ address, hideLocation, location }) => {
  const navigation = useNavigation();

  const formatAddress = () => {
    if (location?.city && location?.state) {
      return `${location.city}, ${location.state}`;
    }
    if (!address) return '';
    let cleaned = address
      .replace(/\d+[A-Z]\+\d+[A-Z],?\s*/g, '')
      .replace(/\s*,\s*India$/i, '')
      .replace(/\d{6},?\s*/g, '');
    const parts = cleaned.split(',').map(part => part.trim()).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[parts.length - 2]}, ${parts[parts.length - 1]}`;
    }
    return cleaned;
  };

  const formattedAddress = formatAddress();

  return (
    <View
      style={[
        styles.fdRow,
        {
          paddingTop: 10,
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 'auto',
        },
      ]}>
      <View
        style={[{ justifyContent: 'center', alignItems: 'center' }]}>
        <Image
          source={images.xsale_logo}
          style={{
            height: 40,
            width: 40,
            resizeMode: 'contain',
            borderRadius: 35,
          }}
        />
      </View>
      {hideLocation ? null : (
        <TouchableOpacity
          style={[styles.fdRow, { alignItems: 'center', maxWidth: '70%' }]}
          onPress={() => navigation.navigate('ChangeLocation', { address })}>
          <Image
            source={icons.location}
            style={[styles.mr4, { tintColor: 'black', height: 25, width: 25 }]}
          />
          <Text
            style={[{ color: colors.black }, styles.ts16]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {formattedAddress}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HomeHeader;