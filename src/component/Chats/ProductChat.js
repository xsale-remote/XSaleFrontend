import {Dimensions, View, Text, Pressable, Image} from 'react-native';
import React from 'react';
import images from '../../assets/images';
import styles from '../../assets/styles';
import icons from '../../assets/icons';
import colors from '../../assets/colors';

const ProductChat = ({
  displayPicture,
  displayName,
  askingPrice,
  location,
  style,
}) => {
  const {height, width} = Dimensions.get('window');
  return (
    <Pressable
      style={[
        {width: '100%', backgroundColor: colors.pink100},
        styles.pdh8,
        styles.fdRow,
        styles.pdv4,
        style,
      ]}>
      <Image
        source={{uri: displayPicture}}
        style={[
          {
            height: '80%',
            width: '20%',
            resizeMode: 'cover',
            borderRadius: 12,
            alignSelf: 'center',
          },
          styles.mr12,
          styles.ml4,
        ]}
      />
      <View style={[styles.mt8]}>
        <Text style={[styles.ts15, {color: colors.black}, styles.mb4]}>
          {displayName}
        </Text>
        <View style={[styles.fdRow, styles.mb4, {color: colors.black}]}>
          <Image
            source={icons.rupee}
            style={[{marginTop: 3}, styles.mr4, styles.icon16]}
          />
          <Text style={[styles.ts17, {fontWeight: '300', color: colors.black}]}>
            {askingPrice}
          </Text>
        </View>
        <Text style={[{width: '75%', color: colors.black}]}>{location}</Text>
      </View>
    </Pressable>
  );
};

export default ProductChat;
