import React from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import images from '../../assets/images';
import styles from '../../assets/styles';
import colors from '../../assets/colors';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import icons from '../../assets/icons';

const ChatCard = ({
  myId,
  name,
  profilePic,
  lastMessageTime,
  lastMessage,
  conversation,
  conversationId,
  phoneNumber,
  // for item info
  isNew,
  itemId,
  displayName,
  itemDisplayPicture,
  itemLocation,
  itemAskingPrice,
  otherUserFCMToken
}) => {

  const navigation = useNavigation();

  const timestamp = lastMessageTime;
  const date = new Date(timestamp);
  const now = new Date();
  const isYesterday = moment(date).isSame(
    moment(now).subtract(1, 'days'),
    'day',
  );

  let displayTime;
  if (isYesterday) {
    displayTime = 'Yesterday';
  } else if (moment(date).isBefore(moment(now).subtract(1, 'days'))) {
    displayTime = moment(date).format('DD-MM-YYYY');
  } else {
    displayTime = moment(date).format('hh:mm A');
  }

  return (
    <Pressable
      style={[
        styles.mb8,
        {
          borderRadius: 8,
          backgroundColor: colors.white,
          shadowColor: colors.black,
          shadowOffset: {width: 0, height: 5},
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 5,
        },
      ]}
      onPress={() => {
        navigation.navigate('ChatScreen', {
          name: name,
          profilePic: profilePic,
          conversation: conversation,
          myId: myId,
          conversationId: conversationId,
          isNew: isNew,
          phoneNumber: phoneNumber,
          productName: displayName,
          askingPrice: itemAskingPrice,
          location: itemLocation,
          itemDisplayPicture: itemDisplayPicture,
          itemId: itemId,
          otherUserFCMToken
        });
      }}>
      <View
        style={[
          {height: 75, width: '100%', borderRadius: 12},
          styles.pdv8,
          styles.pdh12,
          styles.fdRow,
        ]}>
        <Image
          source={profilePic ? {uri: profilePic} : icons.avatar}
          style={[
            {borderRadius: 50, height: 56, width: 56, resizeMode: 'cover'},
          ]}
        />
        <View style={[{width: '80%', height: '100%'}, styles.ml12]}>
          <View>
            <View style={[styles.fdRow, {justifyContent: 'space-between'}]}>
              <Text
                style={[
                  styles.fwBold,
                  styles.ts17,
                  styles.mr8,
                  {color: colors.black},
                ]}>
                {name}
              </Text>
            </View>
          </View>
          <Text
            style={[
              {color: colors.grey800, width: '100%', marginTop: 6},
              styles.fwBold,
            ]}>
            {lastMessage}
          </Text>
          <Text
            style={[{textAlign: 'right', color: colors.grey800}, styles.ts12]}>
            {displayTime}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ChatCard;
