import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import icons from '../../assets/icons';
import styles from '../../assets/styles';
import colors from '../../assets/colors';

const TitleHeader = ({title, onBackPress, style, titleStyle}) => {
  return (
    <View
      style={[
        styles.fdRow,
        styles.mt12,
        styles.mb4,
        {height: 50, width: '100%'},
        style,
      ]}>
      <TouchableOpacity onPress={onBackPress}>
        <Image source={icons.arrow_back} style={[styles.icon36, styles.mt4]} />
      </TouchableOpacity>
      <Text
        style={[
          styles.ts20,
          styles.ml16,
          styles.mt8,
          {color: colors.darkGrey, fontWeight: '300'},
          titleStyle,
        ]}>
        {title}
      </Text>
    </View>
  );
};
export default TitleHeader;
