import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import styles from '../../assets/styles';
import icons from '../../assets/icons';
import colors from '../../assets/colors';

const PremiumOption = ({title, description,style}) => {
  return (
    <TouchableWithoutFeedback>
      <View
        style={[
          styles.fdRow,
          styles.pdh12,
          styles.pdt4,
          styles.pdl16,
          styles.mb12, 
          {
            width: '100%',
            justifyContent: 'space-between',
            height: 'auto',
            height: 60,
            borderRadius: 10,
            shadowColor: colors.black,
            shadowOffset: {width: 10, height: 10},
            shadowOpacity: 0.3,
            shadowRadius: 10,
            backgroundColor: colors.white,
            borderWidth: 0.2,
            elevation: 1,
          },
          style
        ]}>
        <View style={[{width: 'auto'}]}>
          <Text style={[styles.h5, styles.ts17, styles.mt4]}>
            {title}
          </Text>
          <Text style={[styles.mt4, {color : colors.grey900}]}>{description}</Text>
        </View>
        <Image source={icons.arrow_next} style={[styles.icon28, styles.mt12]} />
      </View>
    </TouchableWithoutFeedback>
  );
};
export default PremiumOption;
