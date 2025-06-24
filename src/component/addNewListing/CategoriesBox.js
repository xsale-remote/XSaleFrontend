import React from 'react';
import {View, Text, Image, Pressable} from 'react-native';
import styles from '../../assets/styles';
import colors from '../../assets/colors';
import icons from '../../assets/icons';

const CategoriesBox = ({title, style, onPress, image}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          height: 110,
          width: '48%',
          borderRadius: 12,
          backgroundColor: colors.mintGreen,
          overflow: 'hidden',
        },
        style,
      ]}>
      <View
        style={[
          styles.fdRow,
          styles.pdh12,
          styles.mt8,
          {height: '20%', width: '100%', justifyContent: 'space-between'},
        ]}>
        <Text
          style={[
            styles.ts15,
            {color: colors.white, width: '70%', height: '200%'},
          ]}>
          {title}
        </Text>
        <View
          style={[
            {
              height: 25,
              width: 42,
              borderRadius: 15,
              backgroundColor: colors.white,
              justifyContent: 'center',
            },
          ]}>
          <Image
            source={icons.arrow_next}
            style={[styles.icon24, {alignSelf: 'center'}]}
          />
        </View>
      </View>
      <View
        style={[
          styles.mt4,
          {
            justifyContent: 'center',
            height: '65%',
            alignSelf: 'center',
          },
        ]}>
        <Image
          source={image}
          style={[
            {
              width: 180,
              height: 80,
              borderWidth: 1,
              resizeMode: 'contain',
              alignSelf: 'center',
            },
          ]}
        />
      </View>
    </Pressable>
  );
};
export default CategoriesBox;
