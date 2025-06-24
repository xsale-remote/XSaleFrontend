import React from 'react';
import {Image, Pressable, Text} from 'react-native';
import styles from '../../assets/styles';

const IconButton = ({
  icon,
  label = '',
  onPress,
  iconStyle,
  textstyle,
  containerStyle,
  disabled = false,
}) => (
  <Pressable
    disabled={disabled}
    onPress={onPress}
    style={[styles.fdRow, {alignContent: 'center'}, containerStyle]}>
    <Image
      source={icon}
      style={[
        styles.icon28,
        label.length != 0 ? {marginRight: 4} : {},
        iconStyle,
      ]}
    />
    {label.length != 0 ? (
      <Text style={[styles.ts14, textstyle]}>{label}</Text>
    ) : null}
  </Pressable>
);

export default IconButton;
