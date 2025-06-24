import {View, Text, Pressable, Image} from 'react-native';
import React from 'react';
import styles from '../../assets/styles';
import colors from '../../assets/colors';
import icons from '../../assets/icons';
import {useNavigation} from '@react-navigation/native';

const CategoryCard = ({title, option}) => {
  const Navigation = useNavigation();
  return (
    <Pressable
      onPress={() => Navigation.navigate('ProductsListing', [title, option])}
      style={[
        styles.fdRow,
        styles.mt8,
        {
          width: 'auto',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
      ]}>
      <Text style={[styles.ts18, {color: colors.black}]}>
        {title} {option}
      </Text>
      <Image source={icons.arrow_next} style={[styles.icon28]} />
    </Pressable>
  );
};

export default CategoryCard;
