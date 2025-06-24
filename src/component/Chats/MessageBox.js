import React from 'react';
import {View, Text} from 'react-native';
import styles from '../../assets/styles';
import colors from '../../assets/colors';

const MessageBox = ({senderId, receiverId, message, myId, time}) => {
  const isSentByMe = senderId === myId;

  return (
    <View
      style={[
        styles.mb4,
        styles.p12,
        {
          backgroundColor:  isSentByMe  ? colors.mintGreen : colors.grey800,
          color: isSentByMe ?  colors.white : colors.black,
          height: 'auto',
          maxWidth: '75%',
          alignSelf: isSentByMe ? 'flex-end' : 'flex-start',
          borderTopLeftRadius: isSentByMe ? 15 : 0,
          borderBottomLeftRadius: isSentByMe ? 15 : 0,
          borderTopRightRadius: isSentByMe ? 0 : 15,
          borderBottomRightRadius: isSentByMe ? 0 : 15,
        },
      ]}>
      <Text style={[styles.ts14, {color: colors.white}]}>{message}</Text>
      <Text
        style={[
          styles.ts11,
          {
            color: colors.white,
            textAlign: isSentByMe ? 'right' : 'left',
            marginTop: 5,
          },
        ]}>
        {time}
      </Text>
    </View>
  );
};

export default MessageBox;
