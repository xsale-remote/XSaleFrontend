import {View, Text, Image, StyleSheet, Button} from 'react-native';
import React from 'react';
// import styles from '../../assets/styles';
import colors from '../../assets/colors';
import icons from '../../assets/icons';
import images from '../../assets/images';
import styles from '../../assets/styles';

const SellerProfile = ({style, userImage, name, customerId}) => {
  return (
    <View style={[myStyles.cardContainer, styles.fdRow, styles.pdh12, style]}>
      <Image
        source={userImage ? {uri: userImage} : icons.avatar}
        style={[{width: 60, height: 60, borderRadius: 40}]}
      />
      <View style={[styles.ml16, {justifyContent: 'center'}]}>
        <Text
          style={[
            styles.ts20,
            styles.mb4,
            {color: colors.black, fontWeight: '500'},
          ]}>
          {name}
        </Text>
        <Text style={[styles.ts13, {color: colors.black}]}>
          User Id: <Text style={[styles.ts14]}>{customerId}</Text>
        </Text>
      </View>
    </View>
  );
};
const myStyles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default SellerProfile;
