import {View, Text, SafeAreaView, ScrollView} from 'react-native';
import React from 'react';
import images from '../../assets/images';
import colors from '../../assets/colors';
import styles from '../../assets/styles';
import {ChatScreenHeader, ProductChat} from '../../component/Chats';

const NewChatScreen = ({navigation, route}) => {
  const {
    name,
    myId,
    profilePic,
    askingPrice,
    location,
    productName,
    itemDisplayPicture,
    phoneNumber,
  } = route.params;
  return (
    <SafeAreaView style={[{flex: 1}, styles.pdt4]}>
      <ChatScreenHeader
        name={name}
        profilePic={profilePic}
        userId={myId}
        phoneNumber={phoneNumber}
      />
      <ProductChat
        askingPrice={askingPrice}
        location={location}
        displayName={productName}
        displayPicture={itemDisplayPicture}
      />
      <ScrollView style={[{flex: 1, borderWidth: 1}]}></ScrollView>
    </SafeAreaView>
  );
};

export default NewChatScreen;
