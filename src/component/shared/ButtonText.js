import React from 'react';
import {TouchableOpacity, Text, ActivityIndicator} from 'react-native';
import styles from '../../assets/styles';
import colors from '../../assets/colors';

const ButtonText = ({
  label,
  loading,
  color,
  onPress,
  tintColor,
  style,
  enabled,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      disabled={enabled != undefined ? !enabled : false}
      onPress={onPress}
      style={[
        styles.pdv8,
        {
          borderRadius: 8,
          justifyContent: 'center',
          flexDirection: 'row',
        },
        style,
      ]}>
      {!loading ? (
        <Text
          style={[
            styles.ts16,
            styles.fw500,
            textStyle,
            {
              color: color ? color : colors.primary,
              // textDecorationLine: 'underline',
            },
          ]}>
          {label}
        </Text>
      ) : (
        <ActivityIndicator
          size="small"
          color={color ? color : colors.primary}
          style={[styles.ml8]}
        />
      )}
    </TouchableOpacity>
  );
};

export default ButtonText;
