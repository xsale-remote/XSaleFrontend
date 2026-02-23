import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import styles from '../../assets/styles';
import colors from '../../assets/colors';
import icons from '../../assets/icons';

const ButtonWithIcon = ({ label, icon, style, onPress, isLoading }) => {
  console.log(isLoading , " value")
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.fdRow,
        {
          backgroundColor: colors.darkGrey,
          height: 'auto',
          width: 'auto',
          borderRadius: 40,
          justifyContent: 'center',
          alignItems: 'center',
        },
        styles.pdv12,
        styles.pdh16,
        style,
      ]}>
      {!isLoading &&
        <Image
          source={icon}
          style={[styles.icon28, styles.mr8, { tintColor: colors.white }]}
        />
      }
      {isLoading ? (
        <ActivityIndicator size={'small'} color={colors.white} />
      ) : (
        <Text style={[styles.ts15, { color: colors.white }]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

export default ButtonWithIcon;
