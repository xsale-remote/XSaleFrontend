import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  SafeAreaView,
  Dimensions,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native';
import styles from '../../assets/styles';
import colors from '../../assets/colors';
import {ChatScreenHeader, ProductChat, MessageBox} from '../../component/Chats';
import icons from '../../assets/icons';
import {post, get} from '../../utils/requestBuilder';
import moment from 'moment';
import { getUserInfo } from '../../utils/function';

const renderMessageBox = ({item, myId, previousItem}) => {
  const showDate =
    !previousItem ||
    !moment(previousItem.createdAt).isSame(item.createdAt, 'day');
  const time = moment(item.createdAt).format('h:mm A');

  return (
    <View>
      {showDate && (
        <Text style={{textAlign: 'center', marginVertical: 10, color: '#666'}}>
          {moment(item.createdAt).format('MMMM Do, YYYY')}
        </Text>
      )}
      <MessageBox
        receiverId={item.receiverId}
        senderId={item.senderId}
        message={item.message}
        myId={myId}
        time={time}
      />
    </View>
  );
};

const ChatScreen = props => {
  const {
    name,
    profilePic,
    conversation,
    myId,
    conversationId,
    isNewChat,
    productName,
    askingPrice,
    location,
    itemDisplayPicture,
    phoneNumber,
    sellerId,
    itemId,
    otherUserFCMToken,
    userFCMToken
  } = props.route.params;


  const {height} = Dimensions.get('window');
  const [message, setMessage] = useState('');
  const [messageArray, setMessageArray] = useState([]);
  const [otherUserId, setOtherUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [newConversationId, setNewConversationId] = useState('');
  const [userData, setUserData] = useState(""); 
  const [userName , setUserName] = useState(""); 

  const flatListRef = useRef(null);

  useEffect(() => {
    setNewConversationId(conversationId);
    if (!isNewChat) {
      const otherUserIdFromConversation = conversation.find(
        msg => msg.receiverId !== myId || msg.senderId !== myId,
      );
      if (otherUserIdFromConversation) {
        const {receiverId, senderId} = otherUserIdFromConversation;
        setOtherUserId(receiverId === myId ? senderId : receiverId);
      }
      fetchConversation(conversationId);
    }
    getUser(); 
  }, []);

  const getUser = async () => {
    try {
      const userData = await getUserInfo(); 
      setUserData(userData)
      setUserName(userData.user.userName)
    } catch (error) {
      console.log(`error while getting user data in chats screen ${error}`);
    }
  }

  useEffect(() => {
    if (messageArray.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: messageArray.length - 1,
        animated: true,
      });
    }
  }, [messageArray]);

  const sendMessage = async () => {
    try {
      const body = {
        senderId: myId,
        receiverId: otherUserId === '' ? sellerId : otherUserId,
        content: {
          senderId: myId,
          receiverId: otherUserId === '' ? sellerId : otherUserId,
          message: message.trim(),
        },
        itemId: itemId,
        FCMToken : otherUserFCMToken , 
        senderName : userData.user.userName
      };

      const url = `api/v1/messages/sendMessage`;
      const {response, status} = await post(url, body, true);
      if (status === 200) {
        fetchConversation(response.response.conversationId);
        setNewConversationId(response.response.conversationId);
        setMessageArray(response.response);
        setMessage('');
      } else {
        console.log(`Status is not 200`);
        console.log(response, status);
      }
    } catch (error) {
      console.log(`Error while sending the message ${error}`);
    }
  };

  const fetchConversation = async conversationId => {
    setLoading(true);
    try {
      const url = `api/v1/messages/getConversation/${conversationId}`;
      const {response, status} = await get(url);
      if (status === 200) {
        setMessage('');
        setMessageArray(response.response);
      } else {
        console.log(status, response);
      }
    } catch (error) {
      console.log(`error while fetching the conversation`);
    }
    setLoading(false);
  };

  const handleInput = e => {
    setMessage(e);
  };

  const getItemLayout = (data, index) => ({
    length: 100,
    offset: 100 * index,
    index,
  });

  return (
    <SafeAreaView style={[{flex: 1}, styles.pdt4]}>
      <ChatScreenHeader
        style={[styles.mb4]}
        name={name}
        profilePic={profilePic}
        userId={myId}
        phoneNumber={phoneNumber}
      />
      <ProductChat
        name={name}
        displayName={productName}
        askingPrice={askingPrice}
        location={location}
        displayPicture={itemDisplayPicture}
        style={styles.mb4}
      />

      {loading && messageArray.length === 0 && (
        <ActivityIndicator
          size={'large'}
          style={[{marginTop: 100}]}
          color={colors.darkGrey}
        />
      )}
      {!loading && (
        <FlatList
          ref={flatListRef}
          showsVerticalScrollIndicator={false}
          style={[styles.pdh8, styles.mt4, {marginBottom: 70}]}
          data={messageArray}
          keyExtractor={item => item._id}
          renderItem={({item, index}) =>
            renderMessageBox({
              item,
              myId,
              previousItem: messageArray[index - 1],
            })
          }
          getItemLayout={getItemLayout}
        />
      )}

      <View
        style={[
          styles.pdr16,
          styles.pdl8,
          styles.fdRow,
          styles.ml16,
          {
            backgroundColor: colors.grey700,
            height: height * 0.06,
            width: '93%',
            position: 'absolute',
            bottom: 8,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <TextInput
          placeholder="Enter your message"
          value={message}
          onChangeText={handleInput}
          style={[
            {backgroundColor: colors.grey700, borderRadius: 15, width: '90%' , color : colors.black},
            styles.ts17,
            styles.pdl12,
          ]}
          placeholderTextColor={colors.black}
        />
        <TouchableOpacity onPress={sendMessage} disabled={!message}>
          <Image source={icons.send} style={[styles.icon28]} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
