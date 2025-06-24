import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import colors from '../../assets/colors';
import styles from '../../assets/styles';
import icons from '../../assets/icons';
import images from '../../assets/images';

const HomeHeader = ({name}) => {
  const displayName = name.length > 13 ? name.slice(0, 12) + '...' : name;
  return (
    <View
      style={[
        styles.fdRow,
        {
          paddingTop: 10,
          justifyContent: 'space-between',
          height: 55,
        },
      ]}>
      <View
        style={[{justifyContent: 'center', alignItems: 'center'}, styles.mt4]}>
        <Image
          source={images.xsale_logo}
          style={{
            height: 45,
            width: 45,
            resizeMode: 'contain',
            borderRadius: 35,
          }}
        />
      </View>

      <View style={{height: 70, width: 'auto', marginRight: 10}}>
        <Text
          style={[
            styles.ts22,
            styles.fw400,
            {
              textAlign: 'center',
              color: colors.blackOlive,
              fontFamily: 'Fira Sans',
            },
          ]}>
          Hey {displayName ? displayName : 'User'}
        </Text>
        <Text
          style={[
            styles.h5,
            {
              fontSize: 15,
              color: colors.fleshTint,
              textAlign: 'center',
              fontFamily: 'Fira Sans',
            },
          ]}>
          Welcome
        </Text>
      </View>
      <TouchableOpacity>
        <Image
          source={icons.notification_bell}
          style={[styles.icon40, {marginTop: 5, tintColor: '#f2f2f2'}]}
        />
      </TouchableOpacity>
    </View>
  );
};

export default HomeHeader;
