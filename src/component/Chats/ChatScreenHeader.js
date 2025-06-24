import {
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Image,
  Pressable,
  Linking,
} from 'react-native';
import React from 'react';
import styles from '../../assets/styles';
import icons from '../../assets/icons';
import {useNavigation} from '@react-navigation/native';
import images from '../../assets/images';
import colors from '../../assets/colors';

const ChatScreenHeader = ({style, profilePic, name, phoneNumber}) => {
  const {height, width} = Dimensions.get('window');
  const navigation = useNavigation();

  const handleCallPress = async () => {
    let phoneUrl = `tel:${phoneNumber}`;
    Linking.canOpenURL(phoneUrl)
      .then(supported => {
        // if (!supported) {
        //   console.log("Can't handle url: " + phoneUrl);
        // } else {
        //   return Linking.openURL(phoneUrl);
        // }
          return Linking.openURL(phoneUrl);
      })
      .catch(err => console.error('An error occurred', err));
  };

  return (
    <View
      style={[
        {
          height: height * 0.065,
          width: width * 1,
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        styles.pdh12,
        styles.fdRow,
        style,
      ]}>
      <View style={[styles.fdRow, styles.mt4]}>
        <TouchableOpacity
          onPress={() => navigation.pop()}
          style={[styles.mr12, {alignSelf: 'center'}]}>
          <Image source={icons.arrow_back} style={[styles.icon32]} />
        </TouchableOpacity>
        <View style={[styles.fdRow, {width: '60%'}]}>
          <Image
            source={profilePic ? {uri: profilePic} : icons.avatar}
            style={[
              styles.icon44,
              {borderRadius: 20, resizeMode: 'cover'},
              styles.mr12,
            ]}
          />
          <Text
            style={[
              {alignSelf: 'center', color: colors.black},
              styles.ts18,
              styles.fw400,
            ]}>
            {name}
          </Text>
        </View>
      </View>
      <Pressable onPress={handleCallPress}>
        <Image source={icons.call} style={[styles.icon20, styles.mr12]} />
      </Pressable>
    </View>
  );
};

export default ChatScreenHeader;
