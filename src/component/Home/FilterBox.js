import {
  View,
  Text,
  Pressable,
  Image,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import icons from '../../assets/icons';
import styles from '../../assets/styles';
import colors from '../../assets/colors';

const FilterBox = ({label, style}) => {
  return (
    <Pressable
      style={[
        styles.fdRow,
        styles.pdr12,
        {justifyContent: 'space-between'},
        style,
      ]}>
      <Text style={[styles.ts19, {color: colors.black, fontWeight: '300'}]}>
        {label} Listing
      </Text>
    </Pressable>
  );
};

export default FilterBox;
