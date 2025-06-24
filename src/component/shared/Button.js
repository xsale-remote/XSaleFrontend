import React from 'react';
import {ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import styles from '../../assets/styles';
import colors from '../../assets/colors';

const Button = ({label, style, textStyle, onPress, disable, isLoading}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disable}
      style={[
        styles.pdh12,
        styles.pdv8,
        {
          justifyContent: 'center',
          backgroundColor: colors.darkGrey,
          height: 40,
          width: 'auto',
          borderRadius: 14,
        },
        style,
      ]}>
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.white} />
      ) : (
        <Text
          style={[
            {color: colors.white, textAlign: 'center', fontWeight: '600'},
            styles.ts17,
            textStyle,
          ]}>
          {label ? label : 'Button'}
        </Text>
      )}

      {/* <Text
        style={[
          {color: colors.white, textAlign: 'center'},
          styles.fw700,
          styles.ts17,
          textStyle,
        ]}>
        {label ? label : 'Button'}
      </Text> */}
    </TouchableOpacity>
  );
};
export default Button;
